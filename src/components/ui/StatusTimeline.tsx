import { View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

export interface TimelineStep {
  id: string;
  title: string;
  statusLabel: string;
  /** Reached steps get a filled marker with a tick. */
  reached: boolean;
}

interface StatusTimelineProps {
  steps: readonly TimelineStep[];
  style?: StyleProp<ViewStyle>;
}

/** Design dp, measured from Handover Status in construction.png. */
const d = {
  marker: 10.3,
  markerBorder: 0.9,
  tick: 6.4,
  connector: 0.9,
  rowHeight: 18.8,
  textGap: 6.1,
  // Pulls the title's line box up so its caps centre on the marker.
  textTop: -1,
} as const;

/** Vertical list of steps joined by a line; reached steps are ticked. */
export function StatusTimeline({ steps, style }: StatusTimelineProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <View style={style}>
      {steps.map((step, index) => (
        <View
          key={step.id}
          style={styles.row}
          accessible
          accessibilityLabel={`${step.title}: ${step.statusLabel}`}
        >
          <View style={styles.track}>
            <View style={[styles.marker, step.reached && styles.markerReached]}>
              {step.reached && <CheckIcon size={scale(d.tick)} color={colors.timelineTick} />}
            </View>
            {index < steps.length - 1 && <View style={styles.connector} />}
          </View>
          <View style={styles.text}>
            <AppText variant="labelSmall" color={colors.surfaceText}>
              {step.title}
            </AppText>
            <AppText variant="labelTiny" color={colors.surfaceTextSubtle}>
              {step.statusLabel}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  row: {
    flexDirection: 'row',
    height: scale(d.rowHeight),
  },
  track: {
    width: scale(d.marker),
    alignItems: 'center',
  },
  marker: {
    width: scale(d.marker),
    height: scale(d.marker),
    borderRadius: borderRadius.pill,
    borderWidth: scale(d.markerBorder),
    borderColor: colors.timelinePending,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerReached: {
    borderColor: colors.surfaceIcon,
    backgroundColor: colors.surfaceIcon,
  },
  connector: {
    flex: 1,
    width: scale(d.connector),
    backgroundColor: colors.timelinePending,
  },
  text: {
    marginStart: scale(d.textGap),
    marginTop: scale(d.textTop),
  },
}));
