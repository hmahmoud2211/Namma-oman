import { LinearGradient } from 'expo-linear-gradient';
import { useId, type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

import { AppText } from '@/components/common/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { useSlideToConfirm } from '@/hooks/useSlideToConfirm';
import { toBoxShadow } from '@/theme/shadows';
import { makeStyles } from '@/utils/makeStyles';

/**
 * - `primary`: gold gradient pill with glow (Welcome "GET STARTED")
 * - `emerald`: deep-green gradient pill with a pale-gold rim (Sign In "Sign In")
 * - `secondary`: transparent pill with a gold outline
 * - `outline`: transparent pill with a thin pale-gold outline and label (Home "Explore Community")
 */
export type AppButtonVariant = 'primary' | 'emerald' | 'secondary' | 'outline';
export type AppButtonSize = 'large' | 'medium' | 'small';
export type AppButtonIconPosition = 'leading' | 'trailing';

export interface AppButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  icon?: ReactNode;
  /**
   * `leading`: inside a thin ring at the start edge, title stays centered (Welcome).
   * `trailing`: inline right after the title (Sign In).
   */
  iconPosition?: AppButtonIconPosition;
  /**
   * Turns the leading icon ring into a handle the user drags to the end edge to confirm
   * ("slide to get started"). Taps then only nudge the handle; screen readers still
   * activate it like a normal button. Needs a leading `icon`.
   */
  onSlideComplete?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Dimensions in design dp, measured from the buttons in the Figma exports. */
const BUTTON_HEIGHT: Record<AppButtonSize, number> = { large: 45.5, medium: 31.5, small: 19 };
const ICON_RING_SIZE = 36;
const ICON_RING_INSET = 7;
const ICON_RING_STROKE = 0.6;
const HIGHLIGHT_WIDTH = 0.5;
const EMERALD_BORDER_WIDTH = 0.6;
const TRAILING_ICON_GAP = 6.1;
const LABEL_PADDING = 16;
/** Small pill (Home): tighter padding and a wider gap before the trailing arrow. */
const SMALL_LABEL_PADDING = 9;
const SMALL_TRAILING_ICON_GAP = 11.1;
const OUTLINE_BORDER_WIDTH = 0.8;

/**
 * The gold fill is a slightly tilted, near-vertical gradient: bronze at the bottom-left,
 * khaki at the top-right. The points sit outside the box so the visible range of the
 * gradient matches the design (fitted to the Figma pixels).
 */
const GRADIENT_START = { x: 0.473, y: 1.512 };
const GRADIENT_END = { x: 0.527, y: -0.512 };
const EMERALD_GRADIENT_LOCATIONS = [0, 0.35, 0.75, 1] as const;

export function AppButton({
  title,
  variant = 'primary',
  size = 'large',
  icon,
  iconPosition = 'leading',
  onSlideComplete,
  disabled,
  style,
  ...pressableProps
}: AppButtonProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  const hasLeadingIcon = icon != null && iconPosition === 'leading';
  const hasTrailingIcon = icon != null && iconPosition === 'trailing';
  const slide = useSlideToConfirm({
    onComplete: hasLeadingIcon && !disabled ? onSlideComplete : undefined,
    handleSize: scale(ICON_RING_SIZE),
    handleInset: scale(ICON_RING_INSET),
  });
  // Assistive tech can't drag: its "activate" completes the slide directly.
  const slideAccessibility = slide.enabled
    ? {
        accessibilityActions: [{ name: 'activate' as const }],
        onAccessibilityAction: () => onSlideComplete?.(),
        onAccessibilityTap: () => onSlideComplete?.(),
      }
    : null;

  const labelColor = {
    primary: colors.buttonPrimaryText,
    emerald: colors.buttonEmeraldText,
    secondary: colors.buttonSecondaryText,
    outline: colors.buttonOutlineText,
  }[variant];
  const labelVariant =
    size === 'small' ? 'pillLabel' : variant === 'emerald' ? 'buttonLabel' : 'button';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        hasLeadingIcon
          ? styles.paddedForRing
          : size === 'small'
            ? styles.paddedForSmallLabel
            : styles.paddedForLabel,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...pressableProps}
      {...slideAccessibility}
      // Only slide buttons measure their track; others keep any onLayout they were given.
      {...(onSlideComplete && { onLayout: slide.onLayout })}
    >
      {variant === 'primary' && (
        <>
          <LinearGradient
            colors={colors.buttonPrimaryGradient}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={styles.layer}
            pointerEvents="none"
          />
          <View style={[styles.layer, styles.highlight]} pointerEvents="none" />
        </>
      )}
      {variant === 'emerald' && (
        <>
          <LinearGradient
            colors={colors.buttonEmeraldGradient}
            locations={EMERALD_GRADIENT_LOCATIONS}
            style={styles.layer}
            pointerEvents="none"
          />
          <View style={[styles.layer, styles.emeraldHighlight]} pointerEvents="none" />
        </>
      )}

      {hasLeadingIcon && (
        <Animated.View
          style={[
            styles.iconSlot,
            size === 'large' ? styles.iconSlotLarge : styles.iconSlotMedium,
            slide.enabled && slide.handleStyle,
          ]}
          pointerEvents="none"
        >
          <IconRing
            size={scale(ICON_RING_SIZE)}
            strokeWidth={scale(ICON_RING_STROKE)}
            color={colors.buttonIconRing}
          />
          {icon}
        </Animated.View>
      )}

      <Animated.View
        style={[styles.labelRow, slide.enabled && slide.labelStyle]}
        pointerEvents="none"
      >
        <AppText variant={labelVariant} color={labelColor} numberOfLines={1}>
          {title}
        </AppText>
        {hasTrailingIcon && (
          <View style={size === 'small' ? styles.trailingIconSmall : styles.trailingIcon}>
            {icon}
          </View>
        )}
      </Animated.View>
      {/* Takes every touch on the pill, so a drag can start anywhere along it. */}
      {slide.enabled && <View style={styles.layer} {...slide.panHandlers} />}
    </Pressable>
  );
}

interface IconRingProps {
  size: number;
  strokeWidth: number;
  color: string;
}

/** Hairline ring whose stroke fades diagonally, as in the design. */
function IconRing({ size, strokeWidth, color }: IconRingProps) {
  const gradientId = `ring${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const center = size / 2;

  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
      <Defs>
        <SvgLinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity={0.55} />
          <Stop offset="0.5" stopColor={color} stopOpacity={0} />
          <Stop offset="1" stopColor={color} stopOpacity={0.45} />
        </SvgLinearGradient>
      </Defs>
      <Circle
        cx={center}
        cy={center}
        r={center - strokeWidth / 2}
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        fill="none"
      />
    </Svg>
  );
}

const useStyles = makeStyles(({ colors, borderRadius, shadows }, { scale }) => ({
  base: {
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: {
    height: scale(BUTTON_HEIGHT.large),
  },
  medium: {
    height: scale(BUTTON_HEIGHT.medium),
  },
  small: {
    height: scale(BUTTON_HEIGHT.small),
  },
  paddedForRing: {
    paddingHorizontal: scale(ICON_RING_INSET * 2 + ICON_RING_SIZE),
  },
  paddedForLabel: {
    paddingHorizontal: scale(LABEL_PADDING),
  },
  paddedForSmallLabel: {
    paddingHorizontal: scale(SMALL_LABEL_PADDING),
  },
  primary: {
    boxShadow: toBoxShadow(shadows.buttonGlow, scale),
  },
  emerald: {
    borderWidth: scale(EMERALD_BORDER_WIDTH),
    borderColor: colors.buttonEmeraldBorder,
    boxShadow: toBoxShadow(shadows.emeraldButtonShadow, scale),
  },
  // Lighter teal line just inside the rim along the top edge.
  emeraldHighlight: {
    borderTopWidth: scale(HIGHLIGHT_WIDTH),
    borderTopColor: colors.buttonEmeraldInnerHighlight,
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.buttonSecondaryBorder,
    backgroundColor: colors.transparent,
  },
  outline: {
    borderWidth: scale(OUTLINE_BORDER_WIDTH),
    borderColor: colors.buttonOutlineBorder,
    backgroundColor: colors.transparent,
  },
  layer: {
    ...StyleSheet.absoluteFill,
    borderRadius: borderRadius.pill,
  },
  // Top/bottom-only edge light; with zero side widths it tapers out around the pill ends.
  highlight: {
    borderTopWidth: scale(HIGHLIGHT_WIDTH),
    borderBottomWidth: scale(HIGHLIGHT_WIDTH),
    borderTopColor: colors.buttonPrimaryHighlightTop,
    borderBottomColor: colors.buttonPrimaryHighlightBottom,
  },
  iconSlot: {
    position: 'absolute',
    start: scale(ICON_RING_INSET),
    width: scale(ICON_RING_SIZE),
    height: scale(ICON_RING_SIZE),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSlotLarge: {
    top: scale((BUTTON_HEIGHT.large - ICON_RING_SIZE) / 2),
  },
  iconSlotMedium: {
    top: scale((BUTTON_HEIGHT.medium - ICON_RING_SIZE) / 2),
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trailingIcon: {
    marginStart: scale(TRAILING_ICON_GAP),
  },
  trailingIconSmall: {
    marginStart: scale(SMALL_TRAILING_ICON_GAP),
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
}));
