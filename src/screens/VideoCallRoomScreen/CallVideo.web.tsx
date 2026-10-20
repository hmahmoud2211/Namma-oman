import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import type { MediaStreamTrack } from 'react-native-webrtc';

import type { CallVideoProps } from './CallVideo';

/** The browser's tracks, typed as react-native-webrtc's by the shared call code. */
function asBrowserTrack(track: MediaStreamTrack) {
  return track as unknown as globalThis.MediaStreamTrack;
}

/**
 * One video track in a `<video>` (web). Wrapped in a View: an unpositioned element would paint
 * under the tiles' positioned layers.
 */
export function CallVideo({ track, objectFit, mirror, style }: CallVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;
    video.srcObject = new MediaStream([asBrowserTrack(track)]);
    video.play().catch(() => undefined);
    return () => {
      video.srcObject = null;
    };
  }, [track]);

  return (
    <View style={style}>
      <video
        ref={ref}
        autoPlay
        playsInline
        // Sound comes from CallAudio; your own camera must never echo back.
        muted
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit,
          transform: mirror ? 'scaleX(-1)' : undefined,
        }}
      />
    </View>
  );
}

/** Plays someone's microphone: browsers, unlike the native SDK, don't play remote audio alone. */
export function CallAudio({ track }: { track: MediaStreamTrack }) {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return undefined;
    audio.srcObject = new MediaStream([asBrowserTrack(track)]);
    audio.play().catch(() => undefined);
    return () => {
      audio.srcObject = null;
    };
  }, [track]);

  return <audio ref={ref} autoPlay />;
}
