import { meetConfig } from '@/constants/meetConfig';

import type {
  CloseTracksRequest,
  CreatedRoom,
  IceServer,
  JoinedRoom,
  RoomInfo,
  SessionDescription,
  TracksRequest,
  TracksResponse,
} from './meet.types';

/**
 * A failed request. `status` is the HTTP status, or 0 when the server couldn't be reached;
 * the screens word the message themselves from it (docs/API.md §5).
 */
export class MeetApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    /** Seconds, from `Retry-After` on a 429. */
    readonly retryAfter?: number,
  ) {
    super(message);
    this.name = 'MeetApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT';
  body?: unknown;
  token?: string;
}

async function request<T>(path: string, { method = 'GET', body, token }: RequestOptions = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), meetConfig.requestTimeoutMs);
  let response: Response;
  try {
    response = await fetch(`${meetConfig.apiBase}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new MeetApiError(0, 'Cannot reach the video call server.');
  } finally {
    clearTimeout(timer);
  }

  const text = await response.text();
  let data: Record<string, unknown> = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new MeetApiError(response.status, 'The server sent a malformed response.');
  }
  if (!response.ok) {
    const retryAfter = Number(response.headers.get('Retry-After')) || undefined;
    const message = typeof data.error === 'string' ? data.error : `Request failed (${response.status})`;
    throw new MeetApiError(response.status, message, retryAfter);
  }
  return data as T;
}

/** The lobby: no authentication (§1). */
export const meetApi = {
  createRoom: (title = '') => request<CreatedRoom>('/api/rooms', { method: 'POST', body: { title } }),
  /** Check a code before asking for the camera, so a typo never costs a permission prompt. */
  lookupRoom: (code: string) => request<RoomInfo>(`/api/rooms/${encodeURIComponent(code)}`),
  joinRoom: (code: string, name: string) =>
    request<JoinedRoom>(`/api/rooms/${encodeURIComponent(code)}/join`, {
      method: 'POST',
      body: { name },
    }),
};

/** The media plane, proxied to Cloudflare's SFU with the participant's token (§2). */
export function createRtcApi(token: string) {
  return {
    createSession: () =>
      request<{ sessionId: string; reused: boolean }>('/api/rtc/session', {
        method: 'POST',
        token,
      }),
    tracks: (body: TracksRequest) =>
      request<TracksResponse>('/api/rtc/tracks', { method: 'POST', body, token }),
    renegotiate: (sessionDescription: SessionDescription) =>
      request<unknown>('/api/rtc/renegotiate', {
        method: 'PUT',
        body: { sessionDescription },
        token,
      }),
    closeTracks: (body: CloseTracksRequest) =>
      request<unknown>('/api/rtc/tracks/close', { method: 'PUT', body, token }),
    ice: () => request<{ iceServers: IceServer[] }>('/api/rtc/ice', { token }),
  };
}

export type RtcApi = ReturnType<typeof createRtcApi>;

/** The presence socket's address for a joined seat. */
export function presenceUrl(joined: JoinedRoom) {
  const base = meetConfig.baseUrl.replace(/^http/, 'ws');
  const path = joined.wsUrl.startsWith('/') ? joined.wsUrl : `/${joined.wsUrl}`;
  return `${base}${path}?token=${encodeURIComponent(joined.token)}`;
}
