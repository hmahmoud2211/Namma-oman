import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';

interface AssistantAvatarProps {
  /** Diameter in design dp. */
  size: number;
}

/**
 * A still miniature of the orb, for message headers. Many can be on screen at once, so unlike
 * AssistantOrb it doesn't animate.
 */
export function AssistantAvatar({ size }: AssistantAvatarProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const diameter = scale(size);

  return (
    <View
      style={{
        width: diameter,
        height: diameter,
        borderRadius: diameter / 2,
        overflow: 'hidden',
        borderWidth: scale(0.5),
        borderColor: colors.orbRim,
      }}
    >
      <LinearGradient
        colors={[colors.orbBlobListen, colors.orbCoreGradient[1], colors.orbBlobSpeak]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
