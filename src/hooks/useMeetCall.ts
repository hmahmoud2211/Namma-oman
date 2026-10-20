import { useEffect, useState, useSyncExternalStore } from 'react';

import { MeetCall, openLocalMedia, type CallSnapshot } from '@/services/meet/MeetCall';
import { meetApi } from '@/services/meet/meetApi';
import { loadWebRTC } from '@/services/meet/webrtc';

/**
 * Where getting into the call stands. `unavailable`: this build has no native WebRTC (Expo Go);
 * `media`: the camera and microphone were refused; `join`: the server turned the seat down
 * (`error` holds its MeetApiError).
 */
export type MeetCallPhase =
  | { kind: 'joining' }
  | { kind: 'inCall' }
  | { kind: 'failed'; reason: 'unavailable' | 'media' | 'join' | 'connect'; error?: unknown };

const NO_SNAPSHOT = () => null;
const NO_SUBSCRIPTION = () => () => undefined;

/**
 * Joins a call for as long as the calling screen is mounted, in docs/API.md §4's order: seat
 * first (before the camera), then camera and mic, then the media session and presence.
 * Unmounting hangs up and releases the camera.
 */
export function useMeetCall(code: string, name: string) {
  const [call, setCall] = useState<MeetCall | null>(null);
  const [phase, setPhase] = useState<MeetCallPhase>({ kind: 'joining' });

  useEffect(() => {
    let cancelled = false;
    let active: MeetCall | null = null;

    const run = async () => {
      const webrtc = loadWebRTC();
      if (!webrtc) {
        setPhase({ kind: 'failed', reason: 'unavailable' });
        return;
      }

      let joined;
      try {
        joined = await meetApi.joinRoom(code, name);
      } catch (error) {
        if (!cancelled) setPhase({ kind: 'failed', reason: 'join', error });
        return;
      }
      if (cancelled) return;

      let stream;
      try {
        stream = await openLocalMedia(webrtc);
      } catch (error) {
        if (!cancelled) setPhase({ kind: 'failed', reason: 'media', error });
        return;
      }
      if (cancelled) {
        for (const track of stream.getTracks()) track.stop();
        stream.release?.();
        return;
      }

      active = new MeetCall(webrtc, joined, stream);
      setCall(active);
      setPhase({ kind: 'inCall' });
      try {
        await active.start();
      } catch (error) {
        if (!cancelled) setPhase({ kind: 'failed', reason: 'connect', error });
      }
    };

    void run();
    return () => {
      cancelled = true;
      active?.leave();
    };
  }, [code, name]);

  const snapshot: CallSnapshot | null = useSyncExternalStore(
    call?.subscribe ?? NO_SUBSCRIPTION,
    call?.getSnapshot ?? NO_SNAPSHOT,
  );

  return { call, phase, snapshot };
}
