import { useCallback, useId, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { AppText } from '@/components/common/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

export interface LineChartPoint {
  label: string;
  /** 0–100. */
  value: number;
}

interface LineChartProps {
  points: readonly LineChartPoint[];
  /**
   * Value at the axis line. The design starts its axis above zero so month-to-month
   * changes read clearly; the highest point always reaches `plotHeight`.
   */
  axisMin?: number;
  /** Height from the axis to the highest point, in design dp. */
  plotHeight: number;
  /** Highlighted point; the others dim while one is selected. */
  selectedIndex?: number | null;
  /** Makes each column a button. */
  onSelect?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

/** Design dp. Sized to the Monthly Progress card the bar chart filled (construction.png). */
const d = {
  /** Room above a point for its percentage (its line, then a gap clear of the dot). */
  valueRoom: 13,
  line: 1.6,
  dot: 2.2,
  selectedDot: 3,
  dotStroke: 1,
  axis: 0.6,
  labelGap: 1.6,
  /** Lets a tap on the month label below select its column too. */
  pressSlop: 12,
  dimmedOpacity: 0.4,
  fillOpacity: 0.35,
} as const;

/**
 * Small line chart: a smooth curve through the points over a soft fill, the percentage above
 * each point and the label under the axis. Each point sits in the middle of an equal column,
 * which is also what a tap selects.
 */
export function LineChart({
  points,
  axisMin = 0,
  plotHeight,
  selectedIndex = null,
  onSelect,
  style,
}: LineChartProps) {
  const { colors } = useAppTheme();
  const { isRTL } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const fillId = `lineFill${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [width, setWidth] = useState(0);

  const handleLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setWidth(nativeEvent.layout.width);
  }, []);

  const maxValue = Math.max(...points.map((point) => point.value));
  const range = Math.max(maxValue - axisMin, 1);
  const top = scale(d.valueRoom);
  const height = top + scale(plotHeight);
  const column = points.length > 0 ? width / points.length : 0;

  // The columns follow the layout direction, so in Arabic the first point is on the right.
  const xAt = (index: number) => {
    const x = (index + 0.5) * column;
    return isRTL ? width - x : x;
  };
  const yAt = (value: number) =>
    top + scale(plotHeight) * (1 - Math.max(value - axisMin, 0) / range);
  const coords = points.map((point, index) => ({ x: xAt(index), y: yAt(point.value) }));

  // Each segment eases out of one point and into the next with level tangents, so the curve
  // never overshoots a value.
  const line = coords
    .map(({ x, y }, index) => {
      if (index === 0) return `M ${x} ${y}`;
      const prev = coords[index - 1];
      const mid = (prev.x + x) / 2;
      return `C ${mid} ${prev.y} ${mid} ${y} ${x} ${y}`;
    })
    .join(' ');
  const first = coords[0];
  const last = coords[coords.length - 1];
  const area = first && last ? `${line} L ${last.x} ${height} L ${first.x} ${height} Z` : '';
  const [lineColor] = colors.chartBarGradient;

  return (
    <View
      style={style}
      accessible={!onSelect}
      accessibilityLabel={points.map((point) => `${point.label} ${point.value}%`).join(', ')}
    >
      <View style={{ height }} onLayout={handleLayout}>
        {/* Wrapped: a bare SVG would paint under the card's glass on web. */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {width > 0 && coords.length > 0 && (
            <Svg width={width} height={height}>
              <Defs>
                <LinearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={lineColor} stopOpacity={d.fillOpacity} />
                  <Stop offset="1" stopColor={lineColor} stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <Path d={area} fill={`url(#${fillId})`} />
              <Path
                d={line}
                fill="none"
                stroke={lineColor}
                strokeWidth={scale(d.line)}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {coords.map(({ x, y }, index) => {
                const isSelected = index === selectedIndex;
                const isDimmed = selectedIndex !== null && !isSelected;
                return (
                  <Circle
                    key={points[index].label}
                    cx={x}
                    cy={y}
                    r={scale(isSelected ? d.selectedDot : d.dot)}
                    fill={isSelected ? colors.progressText : lineColor}
                    stroke={colors.surfaceText}
                    strokeWidth={scale(d.dotStroke)}
                    opacity={isDimmed ? d.dimmedOpacity : 1}
                  />
                );
              })}
            </Svg>
          )}
        </View>

        <View
          style={styles.columns}
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
                  style={[styles.value, { top: yAt(point.value) - top }]}
                >
                  {`${point.value}%`}
                </AppText>
              </Pressable>
            );
          })}
        </View>
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
  columns: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  dimmed: {
    opacity: d.dimmedOpacity,
  },
  value: {
    position: 'absolute',
    start: 0,
    end: 0,
    textAlign: 'center',
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
