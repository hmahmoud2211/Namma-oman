import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface ProgressRingProps {
  /** Rendered diameter in dp (already scaled). */
  size: number;
  /** Stroke width in dp (already scaled). */
  strokeWidth: number;
  /** 0–1; the arc runs clockwise from 12 o'clock. */
  progress: number;
  color: string;
  trackColor: string;
  /** Centred inside the ring (e.g. a tick for a finished stage). */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Circular progress meter: a full track with a clockwise arc over it. */
export function ProgressRing({
  size,
  strokeWidth,
  progress,
  color,
  trackColor,
  children,
  style,
}: ProgressRingProps) {
  const centre = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={[{ width: size, height: size }, styles.centre, style]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={centre}
          cy={centre}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {clamped > 0 && (
          <Circle
            cx={centre}
            cy={centre}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference * (1 - clamped)}
            transform={`rotate(-90 ${centre} ${centre})`}
            fill="none"
          />
        )}
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  centre: { alignItems: 'center', justifyContent: 'center' },
});
