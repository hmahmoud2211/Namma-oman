import { LinearGradient } from 'expo-linear-gradient';
import { Fragment, useCallback, useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { GlassLayer } from '@/components/common/GlassLayer';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { toBoxShadow } from '@/theme/shadows';
import { makeStyles } from '@/utils/makeStyles';
import { type AppImageSource, IMAGE_TRANSITION_MS } from '@/constants/images';

export interface FeaturedCommunity {
  id: string;
  name: string;
  /** Short words shown as "Live • Belong • Thrive". */
  pillars: readonly string[];
  /** Description, one entry per line as laid out in the design. */
  descriptionLines: readonly string[];
  photo: AppImageSource;
}

interface FeaturedCommunityCardProps {
  overline: string;
  ctaLabel: string;
  previousLabel: string;
  nextLabel: string;
  communities: readonly FeaturedCommunity[];
  onExplore: (community: FeaturedCommunity) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Design dp, measured from the Featured Community card in home 1.png (295.3 × 123.3).
 * The photo was matched to the export: it sits right of centre and overhangs the top.
 */
const d = {
  height: 123.3,
  radius: 9.5,
  borderWidth: 0.7,
  photo: { top: -24.2, left: 79.5, width: 235.8, height: 176.7 },
  scrimStops: [0, 0.27, 0.42, 0.62] as const, // 0.27 = the photo's left edge
  copy: { top: 8.45, left: 11.6 },
  // The serif's side bearing would leave the title indented past the overline.
  title: { marginTop: -0.65, shiftX: -1.8 },
  pillars: { marginTop: 1.5, dot: 2.8, gap: 6.1 },
  description: { marginTop: 1.5 },
  cta: { top: 94.4, left: 9.3, width: 95.8, arrow: 6.7 },
  counter: { top: 82.7, right: 12.5 },
  pager: {
    top: 95.35,
    right: 6.65,
    size: 20.5,
    gap: 4.2,
    borderWidth: 0.8,
    chevron: 8.4,
    arrow: 7.6,
  },
} as const;

const SCRIM_START = { x: 0, y: 0.5 };
const SCRIM_END = { x: 1, y: 0.5 };
const BOTTOM_SCRIM_LOCATIONS = [0.55, 1] as const;

/** Featured community hero with its own pager ("1 / 4" and back / forward buttons). */
export function FeaturedCommunityCard({
  overline,
  ctaLabel,
  previousLabel,
  nextLabel,
  communities,
  onExplore,
  style,
}: FeaturedCommunityCardProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  const { isRTL } = useLocale();
  const [index, setIndex] = useState(0);

  const count = communities.length;
  const community = communities[Math.min(index, count - 1)];
  const canGoBack = index > 0;
  const canGoForward = index < count - 1;

  const goBack = useCallback(() => setIndex((current) => Math.max(current - 1, 0)), []);
  const goForward = useCallback(
    () => setIndex((current) => Math.min(current + 1, count - 1)),
    [count],
  );

  if (!community) {
    return null;
  }

  return (
    <View style={[styles.card, style]}>
      <GlassLayer
        borderRadius={scale(d.radius - d.borderWidth)}
        colors={colors.heroGlassGradient}
      />
      <View style={styles.clip} pointerEvents="none">
        <Image
          source={community.photo}
          contentFit="cover"
          transition={IMAGE_TRANSITION_MS}
          style={styles.photo}
        />
        <LinearGradient
          colors={colors.heroScrimGradient}
          locations={d.scrimStops}
          // The copy sits at the start edge; the scrim fades away from it.
          start={isRTL ? SCRIM_END : SCRIM_START}
          end={isRTL ? SCRIM_START : SCRIM_END}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={colors.heroScrimBottomGradient}
          locations={BOTTOM_SCRIM_LOCATIONS}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View style={styles.copy}>
        <AppText variant="overline" color={colors.heroOverline}>
          {overline}
        </AppText>
        <AppText
          variant="heroTitle"
          color={colors.heroText}
          numberOfLines={1}
          style={[styles.title, isRTL && styles.titleRTL]}
        >
          {community.name}
        </AppText>
        <View style={styles.pillars} accessibilityLabel={community.pillars.join(', ')}>
          {community.pillars.map((pillar, pillarIndex) => (
            <Fragment key={pillar}>
              {pillarIndex > 0 && <View style={styles.dot} />}
              <AppText variant="heroTagline" color={colors.heroAccent}>
                {pillar}
              </AppText>
            </Fragment>
          ))}
        </View>
        <View style={styles.description}>
          {community.descriptionLines.map((line) => (
            <AppText key={line} variant="heroBody" color={colors.heroText}>
              {line}
            </AppText>
          ))}
        </View>
      </View>

      <AppButton
        title={ctaLabel}
        variant="outline"
        size="small"
        icon={<ArrowRightIcon size={scale(d.cta.arrow)} color={colors.buttonOutlineText} />}
        iconPosition="trailing"
        accessibilityLabel={`${ctaLabel}: ${community.name}`}
        onPress={() => onExplore(community)}
        style={styles.cta}
      />

      <AppText variant="counter" color={colors.heroText} style={styles.counter}>
        {`${index + 1} / ${count}`}
      </AppText>

      <Pressable
        onPress={goBack}
        disabled={!canGoBack}
        accessibilityRole="button"
        accessibilityLabel={previousLabel}
        accessibilityState={{ disabled: !canGoBack }}
        hitSlop={scale(4)}
        style={({ pressed }) => [
          styles.pagerButton,
          styles.previousButton,
          { borderColor: canGoBack ? colors.carouselActive : colors.carouselInactive },
          pressed && styles.pressed,
        ]}
      >
        <ChevronIcon
          size={scale(d.pager.chevron)}
          direction="left"
          color={canGoBack ? colors.carouselActive : colors.heroAccent}
          strokeWidth={2.8}
        />
      </Pressable>
      <Pressable
        onPress={goForward}
        disabled={!canGoForward}
        accessibilityRole="button"
        accessibilityLabel={nextLabel}
        accessibilityState={{ disabled: !canGoForward }}
        hitSlop={scale(4)}
        style={({ pressed }) => [
          styles.pagerButton,
          styles.nextButton,
          { borderColor: canGoForward ? colors.carouselActive : colors.carouselInactive },
          pressed && styles.pressed,
        ]}
      >
        <ArrowRightIcon
          size={scale(d.pager.arrow)}
          color={canGoForward ? colors.carouselActive : colors.heroAccent}
        />
      </Pressable>
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius, shadows }, { scale }) => {
  const radius = scale(d.radius);
  const borderWidth = scale(d.borderWidth);

  return {
    card: {
      height: scale(d.height),
      borderRadius: radius,
      borderWidth,
      borderColor: colors.heroBorder,
      boxShadow: toBoxShadow(shadows.featureCardGlow, scale),
    },
    clip: {
      ...StyleSheet.absoluteFill,
      borderRadius: radius - borderWidth,
      overflow: 'hidden',
    },
    // Explicit width/height: Image pre-fills the asset's intrinsic size.
    photo: {
      position: 'absolute',
      top: scale(d.photo.top),
      start: scale(d.photo.left),
      width: scale(d.photo.width),
      height: scale(d.photo.height),
    },
    copy: {
      position: 'absolute',
      top: scale(d.copy.top),
      start: scale(d.copy.left),
    },
    title: {
      marginTop: scale(d.title.marginTop),
      // A shift, not a negative margin, so the line keeps its full width.
      transform: [{ translateX: scale(d.title.shiftX) }],
    },
    // The shift offsets Playfair's side bearing; the Arabic face needs none.
    titleRTL: {
      transform: [],
    },
    pillars: {
      marginTop: scale(d.pillars.marginTop),
      flexDirection: 'row',
      alignItems: 'center',
    },
    dot: {
      width: scale(d.pillars.dot),
      height: scale(d.pillars.dot),
      marginHorizontal: scale(d.pillars.gap),
      borderRadius: borderRadius.pill,
      backgroundColor: colors.heroAccent,
    },
    description: {
      marginTop: scale(d.description.marginTop),
    },
    cta: {
      position: 'absolute',
      top: scale(d.cta.top),
      start: scale(d.cta.left),
      width: scale(d.cta.width),
    },
    counter: {
      position: 'absolute',
      top: scale(d.counter.top),
      end: scale(d.counter.right),
    },
    pagerButton: {
      position: 'absolute',
      top: scale(d.pager.top),
      width: scale(d.pager.size),
      height: scale(d.pager.size),
      borderRadius: borderRadius.pill,
      borderWidth: scale(d.pager.borderWidth),
      alignItems: 'center',
      justifyContent: 'center',
    },
    previousButton: {
      end: scale(d.pager.right + d.pager.size + d.pager.gap),
    },
    nextButton: {
      end: scale(d.pager.right),
    },
    pressed: {
      opacity: 0.7,
    },
  };
});
