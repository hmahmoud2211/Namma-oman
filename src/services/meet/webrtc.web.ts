import type * as WebRTC from 'react-native-webrtc';

export type WebRTCModule = typeof WebRTC;

/**
 * The browser's own WebRTC, under react-native-webrtc's names so MeetPeer and MeetCall run
 * unchanged (react-native-webrtc follows the W3C API). Only the classes and `mediaDevices` the
 * call uses are provided; video is drawn by CallVideo.web.tsx, not RTCView. Null where the page
 * isn't a secure origin (https or localhost), because browsers hide the camera there.
 */
export function loadWebRTC(): WebRTCModule | null {
  if (
    typeof window === 'undefined' ||
    typeof window.RTCPeerConnection === 'undefined' ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    return null;
  }
  return {
    RTCPeerConnection: window.RTCPeerConnection,
    RTCSessionDescription: window.RTCSessionDescription,
    MediaStream: window.MediaStream,
    mediaDevices: navigator.mediaDevices,
  } as unknown as WebRTCModule;
}
