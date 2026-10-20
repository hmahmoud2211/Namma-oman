import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { type AppImageSource, IMAGE_TRANSITION_MS } from '@/constants/images';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

interface SummaryCardProps {
  photo: AppImageSource;
  /** `contain` for a cut-out (e.g. a car on transparency), set on a night ground. */
  photoFit?: 'cover' | 'contain';
  title: string;
  subtitle?: string;
  /** Beside the subtitle. A string is drawn as the gold pill (e.g. "Owner"); or pass a chip. */
  badge?: ReactNode;
  /** The quieter last line, e.g. the location. */
  meta?: string;
  /** Drawn before `meta`, e.g. a map pin. */
  metaIcon?: ReactNode;
  metaLines?: number;
  /** Under the text, e.g. a carousel indicator. */
  footer?: ReactNode;
  /** Left out, the card is not pressable and has no chevron. */
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Design dp, from the Construction Progress unit card (the card is 296.8 × 68.7). The card
 * keeps that height and grows only when its text needs more room.
 */
const d = {
  minHeight: 68.7,
  radius: 11,
  photo: { inset: 6.1, left: 7.5, width: 118.8, radius: 7.5, borderWidth: 0.5 },
  details: { top: 10.4, bottom: 8.8, left: 138.9, right: 24 },
  rowGap: 4.5,
  badge: { marginLeft: 9.3, minWidth: 41.6, height: 14.5, paddingX: 6, borderWidth: 0.6 },
  meta: { gap: 1.5, iconGap: 3.1 },
  footerGap: 6,
  chevron: { size: 10.4, right: 7.9 },
} as const;

/**
 * The app's photo summary card: a framed photo at the start, then a title, a subtitle with a
 * badge, and a quieter meta line, with a chevron when it opens something. Opens every inner
 * screen as the resident's property card (ResidentPropertyCard), and Parking's cards.
 */
export function SummaryCard({
  photo,
  photoFit = 'cover',
  title,
  subtitle,
  badge,
  meta,
  metaIcon,
  metaLines = 1,
  footer,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  style,
}: SummaryCardProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  const label =
    accessibilityLabel ??
    [title, subtitle, typeof badge === 'string' ? badge : undefined, meta].filter(Boolean).join(', ');

  const card = (
    <SurfaceCard radius={d.radius} rim="feature" style={styles.card}>
      <Image
        source={photo}
        contentFit={photoFit}
        transition={IMAGE_TRANSITION_MS}
        style={[styles.photo, photoFit === 'contain' && styles.photoGround]}
      />
      <View style={styles.details}>
        <AppText variant="panelTitle" color={colors.surfaceText} numberOfLines={1}>
          {title}
        </AppText>
        {subtitle || badge ? (
          <View style={styles.subtitleRow}>
            {subtitle ? (
              <AppText
                variant="bodyLarge"
                color={colors.surfaceText}
                numberOfLines={1}
                style={styles.subtitle}
              >
                {subtitle}
              </AppText>
            ) : null}
            {typeof badge === 'string' ? (
              <View style={styles.badge}>
                <AppText variant="labelLarge" color={colors.badgeText}>
                  {badge}
                </AppText>
              </View>
            ) : (
              badge
            )}
          </View>
        ) : null}
        {meta ? (
          <View style={styles.metaRow}>
            {metaIcon ? <View style={styles.metaIcon}>{metaIcon}</View> : null}
            <AppText
              variant="labelLarge"
              color={colors.surfaceTextMuted}
              numberOfLines={metaLines}
              style={styles.metaText}
            >
              {meta}
            </AppText>
          </View>
        ) : null}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
      {onPress ? (
        <View style={styles.chevron} pointerEvents="none">
          <ChevronIcon size={scale(d.chevron.size)} color={colors.surfaceText} strokeWidth={3} />
        </View>
      ) : null}
    </SurfaceCard>
  );

  if (!onPress) {
    return (
      <View accessible accessibilityLabel={label} style={style}>
        {card}
      </View>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [pressed && styles.pressed, style]}
    >
      {card}
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  card: {
    minHeight: scale(d.minHeight),
  },
  photo: {
    position: 'absolute',
    top: scale(d.photo.inset),
    bottom: scale(d.photo.inset),
    start: scale(d.photo.left),
    width: scale(d.photo.width),
    borderRadius: scale(d.photo.radius),
    borderWidth: scale(d.photo.borderWidth),
    borderColor: colors.photoBorder,
  },
  // A solid night ground: over the light theme's cream the glass alone turns grey.
  photoGround: {
    backgroundColor: colors.cameraFill,
  },
  details: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: scale(d.details.top),
    paddingBottom: scale(d.details.bottom),
    marginStart: scale(d.details.left),
    marginEnd: scale(d.details.right),
  },
  subtitleRow: {
    marginTop: scale(d.rowGap),
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: scale(d.badge.marginLeft),
    rowGap: scale(d.meta.gap),
  },
  subtitle: {
    flexShrink: 1,
  },
  badge: {
    minWidth: scale(d.badge.minWidth),
    height: scale(d.badge.height),
    paddingHorizontal: scale(d.badge.paddingX),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.pill,
    borderWidth: scale(d.badge.borderWidth),
    borderColor: colors.badgeBorder,
    backgroundColor: colors.badgeFill,
  },
  metaRow: {
    marginTop: scale(d.meta.gap),
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginEnd: scale(d.meta.iconGap),
  },
  metaText: {
    flexShrink: 1,
  },
  footer: {
    marginTop: scale(d.footerGap),
  },
  chevron: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    end: scale(d.chevron.right),
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
}));
