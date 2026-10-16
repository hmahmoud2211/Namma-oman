import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { use } from 'react';
import { StyleSheet, View } from 'react-native';

import { BlurTargetContext } from '@/context/BlurTargetContext';
import { useAppTheme } from '@/hooks/useAppTheme';

interface GlassLayerProps {
  /** Rendered corner radius in dp (already scaled). */
  borderRadius: number;
  /** Translucent tint over the blur, top to bottom. */
  colors: readonly [string, string, ...string[]];
  /** Blur tint; defaults to the theme's `glassBlurTint`. */
  tint?: 'light' | 'dark' | 'default';
}

/** How strongly the background behind the glass is blurred (1–100). */
const BLUR_INTENSITY = 40;
const SHEEN_START = { x: 0, y: 0 };
const SHEEN_END = { x: 0.85, y: 0.9 };

/**
 * Frosted-glass backdrop for a panel: the screen background blurred, a translucent tint,
 * and a soft diagonal sheen. Fills its parent; render it first so content sits on top.
 */
export function GlassLayer({ borderRadius, colors, tint }: GlassLayerProps) {
  const { colors: tokens } = useAppTheme();
  const blurTarget = use(BlurTargetContext);

  return (
    <View style={[StyleSheet.absoluteFill, styles.clip, { borderRadius }]} pointerEvents="none">
      <BlurView
        intensity={BLUR_INTENSITY}
        tint={tint ?? tokens.glassBlurTint}
        // Android blurs only a registered target (the screen background, see AppBackground).
        blurMethod="dimezisBlurViewSdk31Plus"
        blurTarget={blurTarget ?? undefined}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient colors={colors} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={tokens.glassSheenGradient}
        start={SHEEN_START}
        end={SHEEN_END}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
});
