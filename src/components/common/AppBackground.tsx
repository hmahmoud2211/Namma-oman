import { BlurTargetView } from 'expo-blur';
import { useRef, type ReactNode } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { BlurTargetContext } from '@/context/BlurTargetContext';
import { useAppTheme } from '@/hooks/useAppTheme';

interface AppBackgroundProps {
  /** Full-bleed artwork; omitted → plain theme background. */
  source?: ImageSourcePropType;
  children: ReactNode;
}

/**
 * Fills the screen edge to edge (under the status bar and home indicator).
 * The theme background shows through any transparent pixels in the artwork, such as
 * the rounded mockup corners baked into the current Figma background exports.
 * The artwork is registered as the blur target for glass surfaces drawn over it.
 */
export function AppBackground({ source, children }: AppBackgroundProps) {
  const { colors } = useAppTheme();
  const blurTargetRef = useRef<View>(null);

  return (
    <View style={[styles.fill, { backgroundColor: colors.background }]}>
      {source && (
        <BlurTargetView ref={blurTargetRef} style={StyleSheet.absoluteFill}>
          <Image source={source} resizeMode="cover" style={styles.image} />
        </BlurTargetView>
      )}
      <BlurTargetContext value={source ? blurTargetRef : null}>{children}</BlurTargetContext>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  // Explicit 100% size: Image pre-fills the asset's intrinsic width/height,
  // which would otherwise win over right/bottom insets.
  image: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
});
