import { View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

export interface ProgressStep {
  id: string;
  label: string;
  /** Lines under the label, e.g. the date and time the step was reached. */
  details?: readonly string[];
}

interface ProgressStepperProps {
  steps: readonly ProgressStep[];
  /** The step in progress; earlier ones are ticked, later ones pending. */
  currentIndex: number;
  style?: StyleProp<ViewStyle>;
}

/** Design dp, matching the Construction Progress timeline's markers. */
const d = { marker: 12, border: 0.9, tick: 7, line: 0.9, labelTop: 4 } as const;

/**
 * A horizontal track of stages (a maintenance request's progress): reached stages are filled
 * and ticked like the handover timeline, the current one is ringed in the accent.
 */
export function ProgressStepper({ steps, currentIndex, style }: ProgressStepperProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <View style={[styles.row, style]}>
      {steps.map((step, index) => {
        const reached =
          index < currentIndex || (index === currentIndex && index === steps.length - 1);
        const current = index === currentIndex && !reached;
        return (
          <View
            key={step.id}
            style={styles.step}
            accessible
            accessibilityLabel={[step.label, ...(step.details ?? [])].join(', ')}
            accessibilityState={{ selected: index === currentIndex }}
          >
            <View style={styles.track}>
              <View
                style={[
                  styles.line,
                  index === 0 && styles.hidden,
                  index <= currentIndex && styles.lineReached,
                ]}
              />
              <View
                style={[
                  styles.marker,
                  reached && styles.markerReached,
                  current && styles.markerCurrent,
                ]}
              >
                {reached && <CheckIcon size={scale(d.tick)} color={colors.timelineTick} />}
              </View>
              <View
                style={[
                  styles.line,
                  index === steps.length - 1 && styles.hidden,
                  index < currentIndex && styles.lineReached,
                ]}
              />
            </View>
            <AppText
              variant="labelSmall"
              color={index <= currentIndex ? colors.surfaceText : colors.surfaceTextSubtle}
              align="center"
              style={styles.label}
            >
              {step.label}
            </AppText>
            {step.details?.map((line) => (
              <AppText
                key={line}
                variant="labelTiny"
                color={colors.surfaceTextSubtle}
                align="center"
              >
                {line}
              </AppText>
            ))}
          </View>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  row: {
    flexDirection: 'row',
  },
  step: {
    flex: 1,
    alignItems: 'center',
  },
  track: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    height: scale(d.line),
    backgroundColor: colors.timelinePending,
  },
  lineReached: {
    backgroundColor: colors.surfaceIcon,
  },
  hidden: {
    opacity: 0,
  },
  marker: {
    width: scale(d.marker),
    height: scale(d.marker),
    borderRadius: borderRadius.pill,
    borderWidth: scale(d.border),
    borderColor: colors.timelinePending,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerReached: {
    borderColor: colors.surfaceIcon,
    backgroundColor: colors.surfaceIcon,
  },
  markerCurrent: {
    borderColor: colors.surfaceAccentText,
    borderWidth: scale(d.border * 2),
  },
  label: {
    marginTop: scale(d.labelTop),
  },
}));
