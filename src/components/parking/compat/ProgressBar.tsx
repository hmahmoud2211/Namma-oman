import { View, type StyleProp, type ViewStyle } from 'react-native';

import { ProgressBar as AppProgressBar } from '@/components/ui/ProgressBar';
import { useResponsive } from '@/hooks/useResponsive';

interface ProgressBarProps {
  /** 0–1. */
  progress: number;
  /** Height in dp, as Parklane sizes it. */
  height: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Parklane's progress bar API on this app's bar, which takes its height in design dp. */
export function ProgressBar({ progress, height, accessibilityLabel, style }: ProgressBarProps) {
  const { scale } = useResponsive();
  const value = Math.round(Math.min(Math.max(progress, 0), 1) * 100);
  return (
    <View
      style={style}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: value }}
    >
      <AppProgressBar progress={progress} height={height / scale(1)} />
    </View>
  );
}
