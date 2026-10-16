import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

export interface BarChartPoint {
  label: string;
  /** 0–100. */
  value: number;
}

interface BarChartProps {
  points: readonly BarChartPoint[];
  /**
   * Value at the axis line. The design starts its axis above zero so month-to-month
   * changes read clearly; the tallest bar always reaches `maxBarHeight`.
   */
  axisMin?: number;
  /** Design dp. */
  maxBarHeight: number;
  /** Highlighted point; the others dim while one is selected. */
  selectedIndex?: number | null;
  /** Makes each column a button. */
  onSelect?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

/** Design dp, measured from Monthly Progress in construction.png. */
const d = {
  barWidth: 14,
  barRadius: 1.6,
  valueGap: 1.4,
  axis: 0.6,
  labelGap: 1.6,
  /** Lets a tap on the month label below select its column too. */
  pressSlop: 12,
  dimmedOpacity: 0.4,
} as const;

/** Small column chart: percentage above each bar, label under the axis. */
export function BarChart({
  points,
  axisMin = 0,
  maxBarHeight,
  selectedIndex = null,
  onSelect,
  style,
}: BarChartProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  const maxValue = Math.max(...points.map((point) => point.value));
  const range = Math.max(maxValue - axisMin, 1);

  return (
    <View
      style={style}
      accessible={!onSelect}
      accessibilityLabel={points.map((point) => `${point.label} ${point.value}%`).join(', ')}
    >
      <View
        style={styles.bars}
        importantForAccessibility={onSelect ? 'auto' : 'no-hide-descendants'}
      >
        {points.map((point, index) => {
          const isSelected = index === selectedIndex;
          const isDimmed = selectedIndex !== null && !isSelected;
          return (
            <Pressable
              key={point.label}
              onPress={onSelect && (() => onSelect(index))}
              disabled={!onSelect}
              hitSlop={{ bottom: scale(d.pressSlop) }}
              accessibilityRole={onSelect ? 'button' : undefined}
              accessibilityLabel={`${point.label} ${point.value}%`}
              accessibilityState={onSelect ? { selected: isSelected } : undefined}
              style={[styles.column, isDimmed && styles.dimmed]}
            >
              <AppText
                variant="labelSmall"
                color={isSelected ? colors.progressText : colors.surfaceText}
              >
                {`${point.value}%`}
              </AppText>
              <LinearGradient
                colors={colors.chartBarGradient}
                style={[
                  styles.bar,
                  { height: scale((Math.max(point.value - axisMin, 0) / range) * maxBarHeight) },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
      <View style={styles.axis} />
      <View style={styles.labels} importantForAccessibility="no-hide-descendants">
        {points.map((point) => (
          <AppText
            key={point.label}
            variant="labelSmall"
            color={colors.surfaceText}
            style={styles.label}
          >
            {point.label}
          </AppText>
        ))}
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors }, { scale }) => ({
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  dimmed: {
    opacity: d.dimmedOpacity,
  },
  bar: {
    marginTop: scale(d.valueGap),
    width: scale(d.barWidth),
    borderTopLeftRadius: scale(d.barRadius),
    borderTopRightRadius: scale(d.barRadius),
  },
  axis: {
    height: scale(d.axis),
    backgroundColor: colors.chartAxis,
  },
  labels: {
    flexDirection: 'row',
    marginTop: scale(d.labelGap),
  },
  label: {
    flex: 1,
    textAlign: 'center',
  },
}));
