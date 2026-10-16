import { BlurView } from 'expo-blur';
import { use, useId, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { BlurTargetContext } from '@/context/BlurTargetContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { ColorTokens } from '@/theme/colors';
import { toBoxShadow } from '@/theme/shadows';
import { makeStyles } from '@/utils/makeStyles';

interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const BORDER_WIDTH = 0.5;

/** How strongly the background behind the card is blurred (1–100). */
const BLUR_INTENSITY = 40;
/** How much of the frosted tint covers the blurred background (0 = clear glass, 1 = opaque). */
const TINT_OPACITY = 0.62;
/** Scales the painted lights so they stay subtle on the translucent glass. */
const LIGHTS_OPACITY = 0.6;

/** Where the base tone changes, top to bottom (matches `glassCardBaseGradient`). */
const BASE_STOPS = [0, 0.2, 0.45, 0.6, 0.8, 0.92, 1] as const;

type LightColor = keyof Pick<
  ColorTokens,
  | 'glassCardHighlight'
  | 'glassCardBottomLight'
  | 'glassCardWarmLight'
  | 'glassCardGoldLight'
  | 'glassCardShade'
>;

interface GlassLight {
  color: LightColor;
  opacity: number;
  /** Centre and radii as fractions of the card. */
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

/**
 * Light map traced from the Sign In card (sampled on a grid against the Figma export):
 * bright behind the title, darker bands high on both sides, warm light at the edges.
 */
const LIGHTS: readonly GlassLight[] = [
  { color: 'glassCardHighlight', opacity: 0.75, cx: 0.58, cy: 0.14, rx: 0.32, ry: 0.13 },
  { color: 'glassCardHighlight', opacity: 0.4, cx: 0.5, cy: 0.26, rx: 0.4, ry: 0.1 },
  { color: 'glassCardShade', opacity: 0.4, cx: 0.12, cy: 0.11, rx: 0.12, ry: 0.14 },
  { color: 'glassCardShade', opacity: 0.35, cx: 0.86, cy: 0.12, rx: 0.12, ry: 0.2 },
  { color: 'glassCardShade', opacity: 0.3, cx: 0.5, cy: 0.5, rx: 0.4, ry: 0.06 },
  { color: 'glassCardShade', opacity: 0.3, cx: 0.02, cy: 0.86, rx: 0.08, ry: 0.12 },
  { color: 'glassCardShade', opacity: 0.3, cx: 0.98, cy: 0.86, rx: 0.08, ry: 0.12 },
  { color: 'glassCardBottomLight', opacity: 0.65, cx: 0.4, cy: 0.95, rx: 0.3, ry: 0.07 },
  { color: 'glassCardWarmLight', opacity: 0.75, cx: 0, cy: 0.45, rx: 0.18, ry: 0.35 },
  { color: 'glassCardWarmLight', opacity: 0.25, cx: 1, cy: 0.35, rx: 0.1, ry: 0.25 },
  { color: 'glassCardWarmLight', opacity: 0.35, cx: 0.78, cy: 0.68, rx: 0.08, ry: 0.08 },
  { color: 'glassCardGoldLight', opacity: 0.55, cx: 0, cy: 1, rx: 0.1, ry: 0.05 },
  { color: 'glassCardGoldLight', opacity: 0.5, cx: 1, cy: 1, rx: 0.1, ry: 0.05 },
];

/**
 * Semi-transparent frosted-glass panel (Sign In card): the background shows through,
 * blurred, under a translucent cool tint with soft lights, framed by a gold rim with an
 * inner white highlight.
 */
export function GlassCard({ children, style }: GlassCardProps) {
  const { colors } = useAppTheme();
  const styles = useStyles();
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const blurTarget = use(BlurTargetContext);

  return (
    <View style={[styles.card, style]}>
      <View style={styles.layer} pointerEvents="none">
        <BlurView
          intensity={BLUR_INTENSITY}
          tint="light"
          blurMethod="dimezisBlurViewSdk31Plus"
          blurTarget={blurTarget ?? undefined}
          style={StyleSheet.absoluteFill}
        />
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id={`${id}base`} x1="0" y1="0" x2="0" y2="1">
              {colors.glassCardBaseGradient.map((color, index) => (
                <Stop key={BASE_STOPS[index]} offset={BASE_STOPS[index]} stopColor={color} />
              ))}
            </LinearGradient>
            {LIGHTS.map((light, index) => (
              <RadialGradient
                key={index}
                id={`${id}light${index}`}
                cx={light.cx}
                cy={light.cy}
                fx={light.cx}
                fy={light.cy}
                rx={light.rx}
                ry={light.ry}
              >
                <Stop offset="0" stopColor={colors[light.color]} stopOpacity={light.opacity * LIGHTS_OPACITY} />
                <Stop offset="1" stopColor={colors[light.color]} stopOpacity={0} />
              </RadialGradient>
            ))}
          </Defs>
          <Rect width="100%" height="100%" fill={`url(#${id}base)`} opacity={TINT_OPACITY} />
          {LIGHTS.map((_light, index) => (
            <Rect key={index} width="100%" height="100%" fill={`url(#${id}light${index})`} />
          ))}
        </Svg>
        <View style={[styles.layer, styles.innerBorder]} />
      </View>
      {children}
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius, shadows }, { scale }) => {
  const radius = scale(borderRadius.card);
  const borderWidth = scale(BORDER_WIDTH);

  return {
    card: {
      borderRadius: radius,
      borderWidth,
      borderColor: colors.glassCardBorder,
      boxShadow: toBoxShadow(shadows.glassCardGlow, scale),
    },
    layer: {
      ...StyleSheet.absoluteFill,
      borderRadius: radius - borderWidth,
      overflow: 'hidden',
    },
    innerBorder: {
      borderWidth,
      borderColor: colors.glassCardInnerBorder,
    },
  };
});
