import type { MediaStreamTrack, RTCPeerConnection } from 'react-native-webrtc';

import type { RtcApi } from './meetApi';
import type { IceServer, PublishedTrack, TrackSource } from './meet.types';
import type { WebRTCModule } from './webrtc';

/** A whole negotiation (offer → server → answer) gets this long before it's abandoned. */
const NEGOTIATION_TIMEOUT_MS = 20_000;
/** How long a pulled track may take to arrive after the SFU's offer is applied. */
const TRACK_ARRIVAL_TIMEOUT_MS = 15_000;
const CONNECT_TIMEOUT_MS = 15_000;

type Transceiver = ReturnType<RTCPeerConnection['addTransceiver']>;

interface LocalPublication extends PublishedTrack {
  track: MediaStreamTrack;
  transceiver: Transceiver;
}

export interface PullRequest {
  participantId: string;
  sessionId: string;
  trackName: string;
  source: TrackSource;
}

export interface PulledTrack extends PullRequest {
  mid: string;
  track: MediaStreamTrack;
}

let trackCounter = 0;

/** `trackName` must match `[A-Za-z0-9_-]{1,64}`; the source prefix lets viewers tell a screen. */
function newTrackName(source: TrackSource) {
  trackCounter += 1;
  return `${source}-${trackCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

/**
 * One Cloudflare Realtime session: a single peer connection that pushes our tracks and pulls
 * everyone else's (docs/API.md §2). Every negotiation runs through one queue, because
 * set{Local,Remote}Description is a one-slot state machine — two at once wedge the connection.
 */
export class MeetPeer {
  pc: RTCPeerConnection | null = null;
  sessionId: string | null = null;
  private closed = false;
  private queue: Promise<unknown> = Promise.resolve();
  private readonly published = new Map<string, LocalPublication>();
  /** Pulls waiting for their `track` event, by mid. */
  private readonly waiting = new Map<string, (track: MediaStreamTrack) => void>();
  /** Tracks that arrived before anyone claimed their mid. */
  private readonly arrived = new Map<string, MediaStreamTrack>();
  private readonly connectionListeners = new Set<(state: string) => void>();

  constructor(
    private readonly webrtc: WebRTCModule,
    private readonly api: RtcApi,
  ) {}

  async connect(iceServers: IceServer[]) {
    const { sessionId } = await this.api.createSession();
    this.sessionId = sessionId;
    const pc = new this.webrtc.RTCPeerConnection({
      iceServers,
      bundlePolicy: 'max-bundle',
      iceCandidatePoolSize: 4,
    });
    pc.addEventListener('track', (event) => {
      const mid = event.transceiver.mid;
      const track = event.track;
      if (!mid || !track) return;
      const resolve = this.waiting.get(mid);
      if (resolve) {
        this.waiting.delete(mid);
        resolve(track);
      } else {
        this.arrived.set(mid, track);
      }
    });
    pc.addEventListener('connectionstatechange', () => {
      for (const listener of this.connectionListeners) listener(pc.connectionState);
    });
    this.pc = pc;
    return sessionId;
  }

  /** Media connection state changes: `connected`, `disconnected`, `failed`… */
  onConnectionState(listener: (state: string) => void) {
    this.connectionListeners.add(listener);
    return () => this.connectionListeners.delete(listener);
  }

  /** Pushes local tracks in one negotiation; resolves with the names the room will see. */
  publish(items: { track: MediaStreamTrack; source: TrackSource }[]) {
    return this.enqueue(async () => {
      const pc = this.pc;
      if (this.closed || !pc || !items.length) return [];
      const publications: LocalPublication[] = items.map(({ track, source }) => ({
        track,
        source,
        kind: track.kind === 'audio' ? 'audio' : 'video',
        name: newTrackName(source),
        transceiver: pc.addTransceiver(track, { direction: 'sendonly' }),
      }));
      await pc.setLocalDescription(await pc.createOffer({}));
      const offer = pc.localDescription;
      if (!offer?.sdp) throw new Error('Could not create a media offer.');
      // A transceiver's mid is only known once the offer is applied locally.
      const response = await this.api.tracks({
        sessionDescription: { type: 'offer', sdp: offer.sdp },
        tracks: publications.map((item) => ({
          location: 'local',
          mid: item.transceiver.mid ?? '',
          trackName: item.name,
          kind: item.kind,
          source: item.source,
        })),
      });
      if (!response.sessionDescription) throw new Error('The server sent no media answer.');
      await pc.setRemoteDescription(
        new this.webrtc.RTCSessionDescription(response.sessionDescription),
      );
      for (const item of publications) this.published.set(item.name, item);
      return publications.map(({ name, kind, source }) => ({ name, kind, source }));
    });
  }

  /** Stops sending tracks and tells the room to stop advertising them. */
  unpublish(names: string[]) {
    return this.enqueue(async () => {
      const items = names.flatMap((name) => this.published.get(name) ?? []);
      if (!items.length) return;
      for (const item of items) {
        await item.transceiver.sender.replaceTrack(null).catch(() => undefined);
        this.published.delete(item.name);
      }
      await this.api.closeTracks({
        tracks: items.flatMap((item) => (item.transceiver.mid ? [{ mid: item.transceiver.mid }] : [])),
        trackNames: items.map((item) => item.name),
        force: true,
      });
    });
  }

  /** Plays other participants' tracks. The SFU offers; we answer. */
  pull(requests: PullRequest[]) {
    return this.enqueue(async () => {
      const pc = this.pc;
      if (this.closed || !pc || !requests.length) return [];
      const response = await this.api.tracks({
        tracks: requests.map(({ sessionId, trackName }) => ({
          location: 'remote',
          sessionId,
          trackName,
        })),
      });

      // Claim every mid before applying the offer: the track events fire during it.
      const ready: PulledTrack[] = [];
      const pending: Promise<PulledTrack | null>[] = [];
      (response.tracks ?? []).forEach((result, index) => {
        const request = requests[index];
        if (!request || result.errorCode || !result.mid) return;
        const mid = result.mid;
        const early = this.arrived.get(mid);
        if (early) {
          this.arrived.delete(mid);
          ready.push({ ...request, mid, track: early });
          return;
        }
        pending.push(
          withTimeout(
            new Promise<PulledTrack>((resolve) => {
              this.waiting.set(mid, (track) => resolve({ ...request, mid, track }));
            }),
            TRACK_ARRIVAL_TIMEOUT_MS,
            'Track never arrived',
          )
            .catch(() => null)
            .finally(() => this.waiting.delete(mid)),
        );
      });

      if (response.requiresImmediateRenegotiation && response.sessionDescription) {
        await pc.setRemoteDescription(
          new this.webrtc.RTCSessionDescription(response.sessionDescription),
        );
        await pc.setLocalDescription(await pc.createAnswer());
        const answer = pc.localDescription;
        if (!answer?.sdp) throw new Error('Could not create a media answer.');
        await this.api.renegotiate({ type: 'answer', sdp: answer.sdp });
      }

      const late = await Promise.all(pending);
      return [...ready, ...late.filter((item): item is PulledTrack => item !== null)];
    });
  }

  /** Swaps what a published track sends (e.g. the other camera) without renegotiating. */
  async replacePublished(name: string, track: MediaStreamTrack) {
    const item = this.published.get(name);
    if (!item) return false;
    await item.transceiver.sender.replaceTrack(track);
    item.track = track;
    return true;
  }

  /**
   * Resolves true once ICE and DTLS have settled. Publishing resolves before any packet reaches
   * the SFU; announcing before this made other people's pulls fail ("Track not found").
   */
  waitUntilConnected(timeoutMs = CONNECT_TIMEOUT_MS) {
    const pc = this.pc;
    if (!pc) return Promise.resolve(false);
    if (pc.connectionState === 'connected') return Promise.resolve(true);
    return new Promise<boolean>((resolve) => {
      const finish = (ok: boolean) => {
        clearTimeout(timer);
        unsubscribe();
        resolve(ok);
      };
      const unsubscribe = this.onConnectionState((state) => {
        if (state === 'connected') finish(true);
        if (state === 'failed' || state === 'closed') finish(false);
      });
      const timer = setTimeout(() => finish(false), timeoutMs);
    });
  }

  /** Outbound mic level (0–1), for the speaking indicator; null where stats don't report it. */
  async micLevel(): Promise<number | null> {
    const pc = this.pc;
    if (!pc) return null;
    try {
      const report: Map<string, { type?: string; kind?: string; audioLevel?: number }> =
        await pc.getStats();
      for (const stat of report.values()) {
        if (stat.type === 'media-source' && stat.kind === 'audio' && stat.audioLevel != null) {
          return stat.audioLevel;
        }
      }
    } catch {
      // Stats are best effort.
    }
    return null;
  }

  close() {
    this.closed = true;
    this.waiting.clear();
    this.arrived.clear();
    this.connectionListeners.clear();
    try {
      this.pc?.close();
    } catch {
      // Already closed.
    }
    this.pc = null;
  }

  private enqueue<T>(task: () => Promise<T>): Promise<T> {
    const run = this.queue.then(() =>
      withTimeout(task(), NEGOTIATION_TIMEOUT_MS, 'Negotiation timed out'),
    );
    this.queue = run.catch(() => undefined);
    return run;
  }
}
