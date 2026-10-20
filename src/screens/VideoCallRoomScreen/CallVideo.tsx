import { useEffect, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { MediaStreamTrack } from 'react-native-webrtc';

import { loadWebRTC } from '@/services/meet/webrtc';

export interface CallVideoProps {
  track: MediaStreamTrack;
  objectFit: 'cover' | 'contain';
  mirror: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * One video track on screen (native: RTCView). RTCView plays a stream, not a track, so the
 * track gets a stream of its own while shown; releasing it leaves the track running.
 */
export function CallVideo({ track, objectFit, mirror, style }: CallVideoProps) {
  const webrtc = loadWebRTC();
  const stream = useMemo(() => (webrtc ? new webrtc.MediaStream([track]) : null), [track, webrtc]);
  useEffect(() => () => stream?.release(false), [stream]);

  if (!webrtc || !stream) return null;
  const { RTCView } = webrtc;
  return <RTCView streamURL={stream.toURL()} objectFit={objectFit} mirror={mirror} style={style} />;
}

/** Native plays remote audio by itself; the web version needs an element (CallVideo.web.tsx). */
export function CallAudio(_props: { track: MediaStreamTrack }) {
  return null;
}
