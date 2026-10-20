import { NativeModules } from 'react-native';
import type * as WebRTC from 'react-native-webrtc';

export type WebRTCModule = typeof WebRTC;

let cached: WebRTCModule | null | undefined;

/**
 * react-native-webrtc, or null when this build has no native WebRTC (Expo Go). Loaded on first
 * use rather than imported, because the package throws or crashes at import time without its
 * native code — that way the rest of the app, and the call lobby, still run in Expo Go.
 */
export function loadWebRTC(): WebRTCModule | null {
  if (cached === undefined) {
    cached = null;
    if (NativeModules.WebRTCModule) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        cached = require('react-native-webrtc') as WebRTCModule;
      } catch {
        cached = null;
      }
    }
  }
  return cached;
}
