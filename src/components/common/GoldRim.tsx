import { useCallback, useId, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Defs, Rect, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

import { useAppTheme } from '@/hooks/useAppTheme';

interface GoldRimProps {
  /** Rendered corner radius of the frame's outer edge, in dp (already scaled). */
  radius: number;
  /** Rendered stroke width, in dp (already scaled). */
  width: number;
  /**
   * The frame's own border width, when it has one: absolute children sit inside a border, so
   * the rim reaches back out over it.
   */
  inset?: number;
}

/**
 * The frames' gold edge: full gold at two opposite corners, fading along every side until it
 * vanishes at the frame's centre line. Draw it after the frame's content; it ignores touches.
 */
export function GoldRim({ radius, width, inset = 0 }: GoldRimProps) {
  const { colors } = useAppTheme();
  const gradientId = `gold${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  const handleLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    const { width: w, height: h } = nativeEvent.layout;
    // A screen hidden under another in the stack lays out at 0 × 0: keep the last rim.
    if (w <= 0 || h <= 0) return;
    setSize((current) => (current?.width === w && current.height === h ? current : { width: w, height: h }));
  }, []);

  return (
    <View
      onLayout={handleLayout}
      pointerEvents="none"
      style={[styles.fill, inset ? { top: -inset, left: -inset, right: -inset, bottom: -inset } : null]}
    >
      {size && (
        <Svg width={size.width} height={size.height}>
          <Defs>
            <SvgLinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.frameRim} stopOpacity={1} />
              <Stop offset="0.5" stopColor={colors.frameRim} stopOpacity={0} />
              <Stop offset="1" stopColor={colors.frameRim} stopOpacity={1} />
            </SvgLinearGradient>
          </Defs>
          <Rect
            x={width / 2}
            y={width / 2}
            width={size.width - width}
            height={size.height - width}
            rx={Math.max(radius - width / 2, 0)}
            stroke={`url(#${gradientId})`}
            strokeWidth={width}
            fill="none"
          />
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFill },
});
