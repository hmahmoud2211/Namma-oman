import { useMemo, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { PanResponder, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';
import { type AppImageSource, IMAGE_TRANSITION_MS } from '@/constants/images';

export interface SiteUpdate {
  id: string;
  date: string;
  title: string;
  body: string;
  photo: AppImageSource;
}

interface LatestUpdateCardProps {
  overline: string;
  /** Accessibility label for a pager dot; receives the update's position (1-based). */
  pageLabel: (position: number) => string;
  updates: readonly SiteUpdate[];
  onOpen: (update: SiteUpdate) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Design dp, from the Latest Update card in construction.png (73.4 high). The photo is
 * narrower than in the export so the copy keeps its width in Home's 296.8-dp column.
 */
// 80 rather than the export's 73.4: room for three lines of body at Parklane's type size.
export const LATEST_UPDATE_CARD_HEIGHT = 80;
const d = {
  radius: 11,
  photo: { top: 4.7, left: 7.5, width: 112, height: 70.6, radius: 7.5, borderWidth: 0.5 },
  copy: { top: 7.5, left: 130.5, right: 24 },
  date: { top: 10, right: 12.2 },
  title: { marginTop: 3.4 },
  body: { marginTop: 2.6 },
  pager: { bottom: 5.4, left: 132.9, dot: 4.7, gap: 4.65, hitSlop: 6 },
  chevron: { size: 10.4, top: 34.8, right: 9.8 },
  /** Horizontal travel (dp) that claims the touch, and that counts as a swipe. */
  swipe: { claim: 10, page: 32 },
} as const;

/** Site news with a photo; swipe it or tap the dots to page through the latest updates. */
export function LatestUpdateCard({
  overline,
  pageLabel,
  updates,
  onOpen,
  style,
}: LatestUpdateCardProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  const { isRTL } = useLocale();
  const [index, setIndex] = useState(0);
  const update = updates[Math.min(index, updates.length - 1)];
  const count = updates.length;
  // Where the current press began: on web a swipe's release still reaches the card as a press.
  const pressStartX = useRef(0);

  // Claims clearly horizontal drags from the card's button, so a swipe pages instead of opening.
  const swipe = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_event, { dx, dy }) =>
          count > 1 && Math.abs(dx) > scale(d.swipe.claim) && Math.abs(dx) > Math.abs(dy) * 1.5,
        onPanResponderRelease: (_event, { dx }) => {
          if (Math.abs(dx) < scale(d.swipe.page)) return;
          // Swiping towards the start edge shows the next update.
          const forward = isRTL ? dx > 0 : dx < 0;
          setIndex((current) => (current + (forward ? 1 : count - 1)) % count);
        },
      }),
    [count, isRTL, scale],
  );

  if (!update) return null;

  return (
    <View style={[styles.wrapper, style]} {...swipe.panHandlers}>
      <Pressable
        onPressIn={({ nativeEvent }) => {
          pressStartX.current = nativeEvent.pageX;
        }}
        onPress={({ nativeEvent }) => {
          if (Math.abs(nativeEvent.pageX - pressStartX.current) < scale(d.swipe.claim)) {
            onOpen(update);
          }
        }}
        accessibilityRole="button"
        accessibilityLabel={`${overline}, ${update.date}: ${update.title}. ${update.body}`}
        style={({ pressed }) => [styles.fill, pressed && styles.pressed]}
      >
        <SurfaceCard radius={d.radius} rim="feature" style={styles.fill}>
          <Image
            source={update.photo}
            contentFit="cover"
            transition={IMAGE_TRANSITION_MS}
            style={styles.photo}
          />
          <AppText variant="labelSmall" color={colors.surfaceTextMuted} style={styles.date}>
            {update.date}
          </AppText>
          <View style={styles.copy}>
            <AppText variant="label" color={colors.surfaceAccentText}>
              {overline}
            </AppText>
            <AppText
              variant="panelHeadline"
              color={colors.surfaceText}
              numberOfLines={1}
              style={styles.title}
            >
              {update.title}
            </AppText>
            <AppText
              variant="bodyTight"
              color={colors.surfaceTextMuted}
              numberOfLines={3}
              style={styles.body}
            >
              {update.body}
            </AppText>
          </View>
          <View style={styles.chevron} pointerEvents="none">
            <ChevronIcon size={scale(d.chevron.size)} color={colors.surfaceText} strokeWidth={3} />
          </View>
        </SurfaceCard>
      </Pressable>

      {/* Outside the card's Pressable so a dot tap switches the update instead of opening it. */}
      <View style={styles.pager}>
        {updates.map((item, position) => {
          const isActive = position === index;
          return (
            <Pressable
              key={item.id}
              onPress={() => setIndex(position)}
              hitSlop={scale(d.pager.hitSlop)}
              accessibilityRole="button"
              accessibilityLabel={pageLabel(position + 1)}
              accessibilityState={{ selected: isActive }}
              style={[styles.dot, isActive && styles.dotActive]}
            />
          );
        })}
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  wrapper: {
    height: scale(LATEST_UPDATE_CARD_HEIGHT),
  },
  fill: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
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
  date: {
    position: 'absolute',
    top: scale(d.date.top),
    end: scale(d.date.right),
  },
  copy: {
    position: 'absolute',
    top: scale(d.copy.top),
    start: scale(d.copy.left),
    end: scale(d.copy.right),
  },
  title: {
    marginTop: scale(d.title.marginTop),
  },
  body: {
    marginTop: scale(d.body.marginTop),
  },
  chevron: {
    position: 'absolute',
    top: scale(d.chevron.top),
    end: scale(d.chevron.right),
  },
  pager: {
    position: 'absolute',
    bottom: scale(d.pager.bottom),
    start: scale(d.pager.left),
    flexDirection: 'row',
    columnGap: scale(d.pager.gap),
  },
  dot: {
    width: scale(d.pager.dot),
    height: scale(d.pager.dot),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.pagerInactive,
  },
  dotActive: {
    backgroundColor: colors.pagerActive,
  },
}));
