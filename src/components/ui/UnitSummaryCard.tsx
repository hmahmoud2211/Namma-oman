import { Image } from 'expo-image';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { HouseIcon } from '@/components/icons/HouseIcon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';
import { type AppImageSource, IMAGE_TRANSITION_MS } from '@/constants/images';

export interface UnitSummary {
  heading: string;
  unitName: string;
  role: string;
  balanceLabel: string;
  currency: string;
  amount: string;
  photo: AppImageSource;
}

interface UnitSummaryCardProps {
  unit: UnitSummary;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Design dp, measured from the My Unit card in home 1.png (the card is 296.8 × 83.7).
 * Text margins are between line boxes, placed so baselines land where the design has them.
 */
const d = {
  height: 83.7,
  radius: 9.5,
  photo: { top: 6.2, left: 7.9, width: 119.5, height: 72, radius: 6, borderWidth: 0.5 },
  details: { top: 11.8, left: 137.7 },
  headingIcon: { size: 14.8, marginLeft: -1.5, gap: 6.3 },
  titleRow: { marginTop: 5.15, height: 14 },
  badge: { marginLeft: 6.9, width: 46, borderWidth: 0.6 },
  balanceLabel: { marginTop: 2.85 },
  amountGap: 5.6,
  chevron: { size: 10.4, top: 33.3, right: 4.9 },
} as const;

/** The resident's unit: photo, unit number with role badge, and outstanding balance. */
export function UnitSummaryCard({ unit, onPress, style }: UnitSummaryCardProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${unit.heading}: ${unit.unitName}, ${unit.role}. ${unit.balanceLabel} ${unit.currency} ${unit.amount}`}
      style={({ pressed }) => [pressed && styles.pressed, style]}
    >
      <SurfaceCard radius={d.radius} rim="feature" style={styles.card}>
        <Image
          source={unit.photo}
          contentFit="cover"
          transition={IMAGE_TRANSITION_MS}
          style={styles.photo}
        />

        <View style={styles.details}>
          <View style={styles.headingRow}>
            <View style={styles.headingIcon}>
              <HouseIcon size={scale(d.headingIcon.size)} color={colors.surfaceIcon} />
            </View>
            <AppText variant="cardLabel" color={colors.surfaceText}>
              {unit.heading}
            </AppText>
          </View>

          <View style={styles.titleRow}>
            <AppText variant="cardTitle" color={colors.surfaceText}>
              {unit.unitName}
            </AppText>
            <View style={styles.badge}>
              <AppText variant="badge" color={colors.badgeText}>
                {unit.role}
              </AppText>
            </View>
          </View>

          <AppText variant="cardLabel" color={colors.surfaceTextMuted} style={styles.balanceLabel}>
            {unit.balanceLabel}
          </AppText>
          <View style={styles.amountRow}>
            <AppText variant="value" color={colors.surfaceText}>
              {unit.currency}
            </AppText>
            <AppText variant="amount" color={colors.surfaceText} style={styles.amount}>
              {unit.amount}
            </AppText>
          </View>
        </View>

        <View style={styles.chevron} pointerEvents="none">
          <ChevronIcon size={scale(d.chevron.size)} color={colors.surfaceText} strokeWidth={3} />
        </View>
      </SurfaceCard>
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  card: {
    height: scale(d.height),
  },
  // Explicit width/height: Image pre-fills the asset's intrinsic size.
  photo: {
    position: 'absolute',
    top: scale(d.photo.top),
    start: scale(d.photo.left),
    width: scale(d.photo.width),
    height: scale(d.photo.height),
    borderRadius: scale(d.photo.radius),
    borderWidth: scale(d.photo.borderWidth),
    borderColor: colors.photoBorder,
  },
  details: {
    position: 'absolute',
    top: scale(d.details.top),
    start: scale(d.details.left),
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headingIcon: {
    marginStart: scale(d.headingIcon.marginLeft),
    marginEnd: scale(d.headingIcon.gap),
  },
  titleRow: {
    marginTop: scale(d.titleRow.marginTop),
    height: scale(d.titleRow.height),
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginStart: scale(d.badge.marginLeft),
    width: scale(d.badge.width),
    height: scale(d.titleRow.height),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.pill,
    borderWidth: scale(d.badge.borderWidth),
    borderColor: colors.badgeBorder,
    backgroundColor: colors.badgeFill,
  },
  balanceLabel: {
    marginTop: scale(d.balanceLabel.marginTop),
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  amount: {
    marginStart: scale(d.amountGap),
  },
  chevron: {
    position: 'absolute',
    top: scale(d.chevron.top),
    end: scale(d.chevron.right),
  },
  pressed: {
    opacity: 0.85,
  },
}));
