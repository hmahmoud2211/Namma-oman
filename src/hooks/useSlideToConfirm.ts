import { useCallback, useMemo, useState } from 'react';
import { Animated, Easing, PanResponder, type LayoutChangeEvent } from 'react-native';

import { useLocale } from '@/hooks/useLocale';

interface SlideToConfirmOptions {
  /** Called once the handle reaches the end. Omit to disable the gesture. */
  onComplete?: () => void;
  /** Width of the draggable handle and its inset from each end, in dp (already scaled). */
  handleSize: number;
  handleInset: number;
}

/** Share of the track the handle must cover for the slide to count. */
const COMPLETE_AT = 0.8;
/** Below this movement (dp) a touch is a tap: the handle nudges to hint at sliding. */
const TAP_SLOP = 6;
const NUDGE = 18;
const FINISH_MS = 140;
/** The handle returns to the start after completing, ready for when the screen is revisited. */
const RESET_DELAY_MS = 600;

/**
 * "Slide to confirm" gesture for a pill with a handle at its start edge: drag the handle
 * towards the end edge (right in English, left in Arabic) to complete.
 * Returns the track's onLayout, pan handlers for the touch area, and animated styles.
 */
export function useSlideToConfirm({ onComplete, handleSize, handleInset }: SlideToConfirmOptions) {
  const { isRTL } = useLocale();
  const [trackWidth, setTrackWidth] = useState(0);
  // State, not a ref: one stable value, and react-native-web has no `useAnimatedValue`.
  const [offset] = useState(() => new Animated.Value(0));

  const travel = Math.max(trackWidth - handleInset * 2 - handleSize, 0);
  const enabled = onComplete != null && travel > 0;

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setTrackWidth(nativeEvent.layout.width);
  }, []);

  const panHandlers = useMemo(() => {
    if (!enabled) return {};
    // Distance along the slide direction: towards the end edge is positive.
    const along = (dx: number) => Math.min(Math.max(isRTL ? -dx : dx, 0), travel);
    const springBack = () =>
      Animated.spring(offset, { toValue: 0, useNativeDriver: true, bounciness: 6 }).start();

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // Keep the drag even if the finger drifts vertically out of the pill.
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_event, { dx }) => offset.setValue(along(dx)),
      onPanResponderRelease: (_event, { dx }) => {
        const distance = along(dx);
        if (distance >= travel * COMPLETE_AT) {
          Animated.timing(offset, {
            toValue: travel,
            duration: FINISH_MS,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start(() => {
            onComplete?.();
            Animated.timing(offset, {
              toValue: 0,
              duration: 0,
              delay: RESET_DELAY_MS,
              useNativeDriver: true,
            }).start();
          });
        } else if (Math.abs(dx) < TAP_SLOP) {
          Animated.sequence([
            Animated.timing(offset, { toValue: NUDGE, duration: 160, useNativeDriver: true }),
            Animated.spring(offset, { toValue: 0, useNativeDriver: true, bounciness: 10 }),
          ]).start();
        } else {
          springBack();
        }
      },
      onPanResponderTerminate: springBack,
    }).panHandlers;
  }, [enabled, isRTL, offset, onComplete, travel]);

  const handleStyle = {
    // Physical translation: towards the right in English, the left in Arabic.
    transform: [{ translateX: Animated.multiply(offset, isRTL ? -1 : 1) }],
  };
  const labelStyle = {
    opacity: offset.interpolate({
      inputRange: [0, Math.max(travel * 0.6, 1)],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
  };

  return { enabled, onLayout, panHandlers, handleStyle, labelStyle };
}
