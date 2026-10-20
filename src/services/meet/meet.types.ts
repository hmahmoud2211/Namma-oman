/**
 * The meet server's contract (docs/API.md). Two planes: control (codes, seats, presence) runs
 * through our server; media runs from the phone straight to Cloudflare's SFU.
 */

/** `POST /api/rooms`. */
export interface CreatedRoom {
  /** Canonical, no dashes: use this in URLs and API calls. */
  code: string;
  /** Show this one to people, e.g. `28JA-XF9J-MEEF`. */
  formattedCode: string;
  joinUrl: string;
  expiresAt: number;
  maxParticipants: number;
}

/** `GET /api/rooms/:code`. */
export interface RoomInfo {
  code: string;
  formattedCode: string;
  title: string;
  participantCount: number;
  maxParticipants: number;
  expiresAt: number;
}

export interface IceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

/** `POST /api/rooms/:code/join`. The seat is held for 60 s until the socket connects. */
export interface JoinedRoom {
  token: string;
  participantId: string;
  /** Sanitised by the server; may differ from what was sent. */
  name: string;
  code: string;
  formattedCode: string;
  maxParticipants: number;
  iceServers: IceServer[];
  /** Relative to the server, e.g. `/ws`. */
  wsUrl: string;
}

/** Ours, not Cloudflare's: it tells the UI what a track shows. */
export type TrackSource = 'mic' | 'camera' | 'screen' | 'screen-audio';

export interface SessionDescription {
  type: 'offer' | 'answer';
  sdp: string;
}

export interface LocalTrackRequest {
  location: 'local';
  mid: string;
  trackName: string;
  kind: 'audio' | 'video';
  source: TrackSource;
}

export interface RemoteTrackRequest {
  location: 'remote';
  sessionId: string;
  trackName: string;
}

/** `POST /api/rtc/tracks`: a push carries our offer; a pull carries none. */
export type TracksRequest =
  | { sessionDescription: SessionDescription; tracks: LocalTrackRequest[] }
  | { tracks: RemoteTrackRequest[] };

export interface TracksResponse {
  /** A push gets an answer; a pull gets an offer from the SFU. */
  sessionDescription?: SessionDescription;
  requiresImmediateRenegotiation?: boolean;
  tracks?: {
    mid?: string;
    trackName?: string;
    errorCode?: string;
    errorDescription?: string;
  }[];
}

export interface CloseTracksRequest {
  tracks: { mid: string }[];
  /** So the room stops advertising them. */
  trackNames: string[];
  /** Cut data flow without renegotiating. */
  force: boolean;
}

/** A participant's broadcast mic / camera / speaking flags. */
export interface ParticipantState {
  mic: boolean;
  cam: boolean;
  screen: boolean;
  speaking: boolean;
}

export interface PublishedTrack {
  name: string;
  kind: 'audio' | 'video';
  source: TrackSource;
}

export interface Participant {
  id: string;
  name: string;
  /** Null until they publish. */
  sessionId: string | null;
  tracks: PublishedTrack[];
  state: ParticipantState;
  joinedAt: number;
}

/** Presence socket, server → client. */
export type PresenceMessage =
  | {
      type: 'welcome';
      self: Participant;
      participants: Participant[];
      maxParticipants: number;
      code: string;
    }
  | { type: 'joined'; participant: Participant }
  | { type: 'left'; participantId: string }
  | { type: 'published'; participantId: string; sessionId: string; track: PublishedTrack }
  | { type: 'unpublished'; participantId: string; trackName: string }
  | { type: 'state'; participantId: string; state: ParticipantState }
  | { type: 'renamed'; participantId: string; name: string }
  | { type: 'error'; message: string }
  | { type: 'pong' };

/** Presence socket, client → server. */
export type PresenceCommand =
  | ({ type: 'state' } & Partial<Pick<ParticipantState, 'mic' | 'cam' | 'speaking'>>)
  | { type: 'rename'; name: string }
  | { type: 'bye' }
  | { type: 'ping' };

/** Another device took over this participant: don't reconnect. */
export const CLOSE_TAKEN_OVER = 4004;
