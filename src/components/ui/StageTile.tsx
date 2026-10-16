import type { ComponentType } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { CheckIcon } from '@/components/icons/CheckIcon';
import type { IconProps } from '@/components/icons/types';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

import { ProgressRing } from './ProgressRing';

export interface ConstructionStage {
  id: string;
  label: string;
  /** 0–100. */
  percent: number;
  Icon: ComponentType<IconProps>;
}

interface StageTileProps {
  stage: ConstructionStage;
  /** Makes the tile a button (e.g. to open the stage's details). */
  onPress?: (stage: ConstructionStage) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Design dp, from the Construction Stages grid in construction.png (48.6 high), with the
 * icon column narrowed so labels fit three tiles across Home's 296.8-dp column.
 * The label and meter are centred as a block, so two-line labels stay balanced.
 */
export const STAGE_TILE_HEIGHT = 48.6;
const d = {
  radius: 10,
  icon: { centreX: 18, centreY: 18.6, size: 22 },
  details: { left: 34 },
  meter: { marginTop: 4.4, ring: 18.2, stroke: 2.3, doneStroke: 1.1, tick: 9, valueGap: 6 },
} as const;

/** One construction stage: icon, name, and a ring meter with its percentage. */
export function StageTile({ stage, onPress, style }: StageTileProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  const { label, percent, Icon } = stage;
  const isDone = percent >= 100;

  return (
    <Pressable
      onPress={onPress && (() => onPress(stage))}
      disabled={!onPress}
      accessible
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${label.replace('\n', ' ')}: ${percent}%`}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed, style]}
    >
      <SurfaceCard radius={d.radius} rim="feature" style={styles.card}>
        <View style={styles.icon} pointerEvents="none">
          <Icon size={scale(d.icon.size)} color={colors.surfaceIcon} />
        </View>
        <View style={styles.details} importantForAccessibility="no-hide-descendants">
          <AppText variant="label" color={colors.surfaceText}>
            {label}
          </AppText>
          <View style={styles.meter}>
            <ProgressRing
              size={scale(d.meter.ring)}
              strokeWidth={scale(isDone ? d.meter.doneStroke : d.meter.stroke)}
              progress={isDone ? 0 : percent / 100}
              color={colors.progressText}
              trackColor={isDone ? colors.progressText : colors.progressTrack}
            >
              {isDone && <CheckIcon size={scale(d.meter.tick)} color={colors.progressText} />}
            </ProgressRing>
            <AppText variant="statMedium" color={colors.progressText} style={styles.value}>
              {`${percent}%`}
            </AppText>
          </View>
        </View>
      </SurfaceCard>
    </Pressable>
  );
}

const useStyles = makeStyles((_theme, { scale }) => ({
  tile: {
    height: scale(STAGE_TILE_HEIGHT),
  },
  card: {
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  icon: {
    position: 'absolute',
    start: scale(d.icon.centreX - d.icon.size / 2),
    top: scale(d.icon.centreY - d.icon.size / 2),
  },
  details: {
    flex: 1,
    justifyContent: 'center',
    marginStart: scale(d.details.left),
  },
  meter: {
    marginTop: scale(d.meter.marginTop),
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    marginStart: scale(d.meter.valueGap),
  },
}));
