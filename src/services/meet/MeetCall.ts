import { Platform } from 'react-native';
import type { MediaStream, MediaStreamTrack } from 'react-native-webrtc';

import { MeetPeer, type PullRequest } from './MeetPeer';
import { createRtcApi, presenceUrl } from './meetApi';
import {
  CLOSE_TAKEN_OVER,
  type JoinedRoom,
  type Participant,
  type ParticipantState,
  type PresenceCommand,
  type PresenceMessage,
  type TrackSource,
} from './meet.types';
import type { WebRTCModule } from './webrtc';

/** Socket reconnect delays; the call itself keeps running meanwhile (media is direct). */
const RECONNECT_DELAYS_MS = [500, 1_000, 2_000, 4_000, 8_000, 15_000];
/** Tracks per pull request, so a big room never exceeds the server's per-request cap. */
const PULL_CHUNK = 12;
/** The roster is authoritative: anything in it we don't hold is re-pulled this often. */
const RECONCILE_MS = 5_000;
const SPEAKING_POLL_MS = 400;
const SPEAKING_LEVEL = 0.04;
/** Keeps the indicator from flickering between words. */
const SPEAKING_HOLD_MS = 900;
/** Enough for a phone-sized tile without loading the uplink. */
const VIDEO_CONSTRAINTS = {
  width: { ideal: 640 },
  height: { ideal: 480 },
  frameRate: { ideal: 24 },
};

export type CallStatus = 'connecting' | 'connected' | 'reconnecting' | 'failed' | 'ended';
/** Why the call ended or failed, for the screen to word. */
export type CallProblem = 'takenOver' | 'mediaFailed' | 'connectFailed';
export type CameraFacing = 'user' | 'environment';

export interface CallMember {
  id: string;
  name: string;
  isSelf: boolean;
  state: ParticipantState;
  camera: MediaStreamTrack | null;
  screen: MediaStreamTrack | null;
  /** Their microphone (and shared screen's sound); never your own. */
  audio: MediaStreamTrack[];
}

export interface CallSnapshot {
  status: CallStatus;
  problem: CallProblem | null;
  code: string;
  formattedCode: string;
  maxParticipants: number;
  /** You first, then everyone else in the order they joined. */
  members: CallMember[];
  mic: boolean;
  cam: boolean;
  facing: CameraFacing;
  hasCamera: boolean;
  hasMic: boolean;
}

interface RemoteTrack {
  participantId: string;
  trackName: string;
  source: TrackSource;
  track: MediaStreamTrack;
}

const DEFAULT_STATE: ParticipantState = { mic: true, cam: true, screen: false, speaking: false };

/**
 * A joined call: publishes the local camera and mic, keeps the roster from the presence socket
 * and pulls everyone's tracks. Follows docs/API.md §4 in order — the same sequence as the web
 * client, so the two interoperate. Holds no UI; screens read `getSnapshot()`.
 */
export class MeetCall {
  private readonly peer: MeetPeer;
  private readonly participants = new Map<string, Participant>();
  private readonly remoteTracks = new Map<string, RemoteTrack>();
  private readonly pulling = new Set<string>();
  private readonly listeners = new Set<() => void>();
  private snapshot: CallSnapshot;

  private socket: WebSocket | null = null;
  private reconnects = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconcileTimer: ReturnType<typeof setInterval> | null = null;
  private speakingTimer: ReturnType<typeof setInterval> | null = null;
  private lastVoiceAt = 0;

  private mediaState = 'new';
  private signalling: 'connecting' | 'connected' | 'reconnecting' = 'connecting';
  private problem: CallProblem | null = null;
  private left = false;

  private maxParticipants: number;
  private selfName: string;
  private mic: boolean;
  private cam: boolean;
  private speaking = false;
  private facing: CameraFacing = 'user';
  /** Our camera's name in the room, for swapping what it sends. */
  private cameraTrackName: string | null = null;

  constructor(
    private readonly webrtc: WebRTCModule,
    private readonly joined: JoinedRoom,
    private readonly localStream: MediaStream,
  ) {
    this.peer = new MeetPeer(webrtc, createRtcApi(joined.token));
    this.maxParticipants = joined.maxParticipants;
    this.selfName = joined.name;
    this.mic = this.audioTrack !== null;
    this.cam = this.videoTrack !== null;
    const facing = this.videoTrack?.getSettings().facingMode;
    if (facing === 'environment') this.facing = 'environment';
    this.snapshot = this.buildSnapshot();
  }

  private get audioTrack() {
    return this.localStream.getAudioTracks()[0] ?? null;
  }

  private get videoTrack() {
    return this.localStream.getVideoTracks()[0] ?? null;
  }

  /** Session → publish → wait for media → presence socket (checklist steps 3–7). */
  async start() {
    try {
      await this.peer.connect(this.joined.iceServers);
      this.peer.onConnectionState((state) => {
        this.mediaState = state;
        if (state === 'failed') this.problem = 'mediaFailed';
        if (state === 'connected' && this.problem === 'mediaFailed') this.problem = null;
        this.changed();
      });

      const items: { track: MediaStreamTrack; source: TrackSource }[] = [];
      if (this.audioTrack) items.push({ track: this.audioTrack, source: 'mic' });
      if (this.videoTrack) items.push({ track: this.videoTrack, source: 'camera' });
      const published = await this.peer.publish(items);
      this.cameraTrackName = published.find((item) => item.source === 'camera')?.name ?? null;
      if (published.length && !(await this.peer.waitUntilConnected())) {
        // Carry on: the socket still brings the roster, and reconcile retries the pulls.
        console.warn('[meet] publishing before the media connection settled');
      }
    } catch (error) {
      if (!this.left) {
        this.problem = 'connectFailed';
        this.changed();
      }
      throw error;
    }
    if (this.left) return;

    this.openSocket();
    this.reconcileTimer = setInterval(() => void this.reconcile(), RECONCILE_MS);
    this.speakingTimer = setInterval(() => void this.pollSpeaking(), SPEAKING_POLL_MS);
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.snapshot;

  setMic(on: boolean) {
    const track = this.audioTrack;
    if (!track) return;
    // Mute by disabling, never by stopping: stopping forces everyone to renegotiate.
    track.enabled = on;
    this.mic = on;
    if (!on) this.speaking = false;
    this.send({ type: 'state', mic: on, ...(on ? {} : { speaking: false }) });
    this.changed();
  }

  setCamera(on: boolean) {
    const track = this.videoTrack;
    if (!track) return;
    track.enabled = on;
    this.cam = on;
    this.send({ type: 'state', cam: on });
    this.changed();
  }

  /**
   * Front ↔ rear, with no renegotiation: the far end just sees the other camera. Native
   * switches the running track; browsers can't, so there the other camera's track replaces it
   * in the sender. Throws when there's no other camera (e.g. a laptop).
   */
  async flipCamera() {
    const track = this.videoTrack;
    if (!track) return this.facing;
    const next: CameraFacing = this.facing === 'user' ? 'environment' : 'user';
    if (Platform.OS === 'web') {
      const stream = await this.webrtc.mediaDevices.getUserMedia({
        video: { ...VIDEO_CONSTRAINTS, facingMode: { exact: next } },
      });
      const fresh = stream.getVideoTracks()[0];
      if (!fresh) throw new Error('No other camera');
      fresh.enabled = track.enabled;
      if (this.cameraTrackName) await this.peer.replacePublished(this.cameraTrackName, fresh);
      this.localStream.removeTrack(track);
      this.localStream.addTrack(fresh);
      track.stop();
    } else {
      await track.applyConstraints({ facingMode: next });
    }
    this.facing = next;
    this.changed();
    return next;
  }

  /** Hangs up: tells the room, closes the socket and the media, releases the camera. */
  leave() {
    if (this.left) return;
    this.left = true;
    this.send({ type: 'bye' });
    this.stopTimers();
    try {
      this.socket?.close(1000, 'Left the call');
    } catch {
      // Already closed.
    }
    this.socket = null;
    this.peer.close();
    for (const track of this.localStream.getTracks()) track.stop();
    // Browsers' streams have nothing to release.
    this.localStream.release?.();
    this.changed();
  }

  // Presence -------------------------------------------------------------------------------

  private openSocket() {
    if (this.left) return;
    const socket = new WebSocket(presenceUrl(this.joined));
    this.socket = socket;

    socket.onopen = () => {
      this.reconnects = 0;
      this.signalling = 'connected';
      // The server learns our mic/camera from us, not from the tracks.
      this.send({ type: 'state', mic: this.mic, cam: this.cam, speaking: this.speaking });
      this.changed();
    };
    socket.onmessage = (event) => {
      let message: PresenceMessage;
      try {
        message = JSON.parse(String(event.data));
      } catch {
        return;
      }
      this.handle(message).catch((error) => console.warn('[meet] handler failed', error));
    };
    socket.onclose = (event) => {
      if (this.left || socket !== this.socket) return;
      this.socket = null;
      if (event.code === CLOSE_TAKEN_OVER) {
        // Another device took over this seat: don't fight it.
        this.problem = 'takenOver';
        this.leave();
        return;
      }
      this.signalling = 'reconnecting';
      this.changed();
      const delay = RECONNECT_DELAYS_MS[Math.min(this.reconnects, RECONNECT_DELAYS_MS.length - 1)];
      this.reconnects += 1;
      this.reconnectTimer = setTimeout(() => this.openSocket(), delay);
    };
    socket.onerror = () => {
      // onclose follows and reconnects.
    };
  }

  private send(command: PresenceCommand) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(command));
    }
  }

  private async handle(message: PresenceMessage) {
    switch (message.type) {
      case 'welcome': {
        this.maxParticipants = message.maxParticipants;
        this.selfName = message.self.name;
        this.participants.clear();
        for (const participant of message.participants) {
          this.participants.set(participant.id, participant);
        }
        // After a reconnect, drop anyone who left while we were away.
        for (const [key, remote] of this.remoteTracks) {
          if (!this.participants.has(remote.participantId)) this.remoteTracks.delete(key);
        }
        this.changed();
        await this.pullTracks(message.participants.flatMap(pullRequestsFor));
        break;
      }
      case 'joined':
        this.participants.set(message.participant.id, message.participant);
        this.changed();
        await this.pullTracks(pullRequestsFor(message.participant));
        break;
      case 'left':
        this.participants.delete(message.participantId);
        for (const [key, remote] of this.remoteTracks) {
          if (remote.participantId === message.participantId) this.remoteTracks.delete(key);
        }
        this.changed();
        break;
      case 'published': {
        const existing = this.participants.get(message.participantId);
        const participant: Participant = existing ?? {
          id: message.participantId,
          name: '',
          sessionId: message.sessionId,
          tracks: [],
          state: { ...DEFAULT_STATE },
          joinedAt: Date.now(),
        };
        participant.sessionId = message.sessionId;
        participant.tracks = [
          ...participant.tracks.filter((track) => track.name !== message.track.name),
          message.track,
        ];
        this.participants.set(participant.id, participant);
        this.changed();
        await this.pullTracks([
          {
            participantId: participant.id,
            sessionId: message.sessionId,
            trackName: message.track.name,
            source: message.track.source,
          },
        ]);
        break;
      }
      case 'unpublished': {
        const participant = this.participants.get(message.participantId);
        if (participant) {
          participant.tracks = participant.tracks.filter((track) => track.name !== message.trackName);
        }
        this.remoteTracks.delete(trackKey(message.participantId, message.trackName));
        this.changed();
        break;
      }
      case 'state': {
        const participant = this.participants.get(message.participantId);
        if (participant) {
          participant.state = message.state;
          this.changed();
        }
        break;
      }
      case 'renamed': {
        const participant = this.participants.get(message.participantId);
        if (participant) {
          participant.name = message.name;
          this.changed();
        }
        break;
      }
      case 'error':
        console.warn('[meet] server said:', message.message);
        break;
      case 'pong':
        break;
    }
  }

  // Media ----------------------------------------------------------------------------------

  private async pullTracks(requests: PullRequest[]) {
    const wanted = requests.filter((request) => {
      const key = trackKey(request.participantId, request.trackName);
      if (!request.sessionId || this.remoteTracks.has(key) || this.pulling.has(key)) return false;
      this.pulling.add(key);
      return true;
    });
    if (!wanted.length) return;
    try {
      for (let start = 0; start < wanted.length; start += PULL_CHUNK) {
        try {
          const pulled = await this.peer.pull(wanted.slice(start, start + PULL_CHUNK));
          for (const item of pulled) {
            // They may have left while the pull was in flight.
            if (!this.participants.has(item.participantId)) continue;
            this.remoteTracks.set(trackKey(item.participantId, item.trackName), item);
          }
          this.changed();
        } catch (error) {
          console.warn('[meet] pull failed; reconcile will retry', error);
        }
      }
    } finally {
      for (const request of wanted) this.pulling.delete(trackKey(request.participantId, request.trackName));
    }
  }

  /** Re-pulls anything the roster lists that we don't hold (a missed or failed pull). */
  private async reconcile() {
    if (this.left) return;
    const missing = [...this.participants.values()].flatMap(pullRequestsFor);
    await this.pullTracks(missing);
  }

  private async pollSpeaking() {
    if (this.left || !this.mic) return;
    const level = await this.peer.micLevel();
    if (level == null) return;
    const now = Date.now();
    if (level > SPEAKING_LEVEL) this.lastVoiceAt = now;
    const speaking = now - this.lastVoiceAt < SPEAKING_HOLD_MS;
    if (speaking !== this.speaking) {
      this.speaking = speaking;
      this.send({ type: 'state', speaking });
      this.changed();
    }
  }

  private stopTimers() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.reconcileTimer) clearInterval(this.reconcileTimer);
    if (this.speakingTimer) clearInterval(this.speakingTimer);
    this.reconnectTimer = null;
    this.reconcileTimer = null;
    this.speakingTimer = null;
  }

  // Snapshot -------------------------------------------------------------------------------

  private changed() {
    this.snapshot = this.buildSnapshot();
    for (const listener of this.listeners) listener();
  }

  private status(): CallStatus {
    if (this.left) return 'ended';
    if (this.problem === 'connectFailed' || this.mediaState === 'failed') return 'failed';
    if (this.mediaState === 'disconnected' || this.signalling === 'reconnecting') {
      return 'reconnecting';
    }
    if (this.mediaState === 'connected' && this.signalling === 'connected') return 'connected';
    return 'connecting';
  }

  private buildSnapshot(): CallSnapshot {
    const self: CallMember = {
      id: this.joined.participantId,
      name: this.selfName,
      isSelf: true,
      state: { mic: this.mic, cam: this.cam, screen: false, speaking: this.speaking },
      camera: this.videoTrack,
      screen: null,
      audio: [],
    };
    const others = [...this.participants.values()]
      .filter((participant) => participant.id !== this.joined.participantId)
      .sort((a, b) => a.joinedAt - b.joinedAt)
      .map((participant): CallMember => {
        const held = participant.tracks.map(
          (track) => this.remoteTracks.get(trackKey(participant.id, track.name)) ?? null,
        );
        const find = (source: TrackSource) =>
          held.find((remote) => remote?.source === source)?.track ?? null;
        return {
          id: participant.id,
          name: participant.name,
          isSelf: false,
          state: { ...DEFAULT_STATE, ...participant.state },
          camera: find('camera'),
          screen: find('screen'),
          audio: held.flatMap((remote) =>
            remote && remote.track.kind === 'audio' ? [remote.track] : [],
          ),
        };
      });

    return {
      status: this.status(),
      problem: this.problem,
      code: this.joined.code,
      formattedCode: this.joined.formattedCode,
      maxParticipants: this.maxParticipants,
      members: [self, ...others],
      mic: this.mic,
      cam: this.cam,
      facing: this.facing,
      hasCamera: this.videoTrack !== null,
      hasMic: this.audioTrack !== null,
    };
  }
}

function trackKey(participantId: string, trackName: string) {
  return `${participantId}:${trackName}`;
}

function pullRequestsFor(participant: Participant): PullRequest[] {
  if (!participant.sessionId) return [];
  const sessionId = participant.sessionId;
  return participant.tracks.map((track) => ({
    participantId: participant.id,
    sessionId,
    trackName: track.name,
    source: track.source,
  }));
}

/**
 * Camera and mic for a call. Falls back to audio only when there's no usable camera, so a
 * resident can still join and listen; throws only when neither is available.
 */
export async function openLocalMedia(webrtc: WebRTCModule): Promise<MediaStream> {
  const video = { ...VIDEO_CONSTRAINTS, facingMode: 'user' };
  try {
    return await webrtc.mediaDevices.getUserMedia({ audio: true, video });
  } catch (error) {
    try {
      return await webrtc.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch {
      throw error;
    }
  }
}
