import { Platform } from 'react-native';

/**
 * The EMS video conference server (Cloudflare Realtime behind our own control plane; see the
 * meet project's docs/API.md). Override with EXPO_PUBLIC_MEET_URL, e.g. for a staging server.
 */
const baseUrl = (process.env.EXPO_PUBLIC_MEET_URL || 'https://meet.ems-iot.com').replace(/\/+$/, '');

/**
 * The server sends no CORS headers, so in the browser the REST calls go to `/meet/...` on our
 * own origin and are forwarded: by the dev server (metro.config.js) and by Vercel in
 * production (vercel.json). The presence WebSocket isn't subject to CORS and connects directly.
 * Once the server allows this origin, set EXPO_PUBLIC_MEET_API_BASE to its URL to skip the hop.
 */
const webApiBase = (process.env.EXPO_PUBLIC_MEET_API_BASE || '/meet').replace(/\/+$/, '');

export const meetConfig = {
  baseUrl,
  apiBase: Platform.OS === 'web' ? webApiBase : baseUrl,
  /** Meeting codes are 12 characters, shown in groups of four. */
  codeLength: 12,
  codeGroup: 4,
  /** REST calls give up after this long; negotiation has its own, longer budget. */
  requestTimeoutMs: 15_000,
} as const;
