import { useMemo, type ReactNode, type Ref } from 'react';
import {
  TextInput,
  View,
  type StyleProp,
  type TextInputInstance,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';
import { scaleTextStyle } from '@/utils/textStyle';

const MAX_FONT_SIZE_MULTIPLIER = 1.3;

/** Dimensions in design dp, measured from the Sign In fields in the Figma export. */
const FIELD_HEIGHT = 32.6;
const SLOT_WIDTH = 22;
const LEADING_SLOT_INSET = 6.4;
const TEXT_INSET_AFTER_ICON = 6.4;
const TEXT_INSET_WITHOUT_ICON = 12;
const TRAILING_SLOT_INSET = 6.35;
const BORDER_WIDTH = 0.5;

export interface AppInputProps
  extends Omit<TextInputProps, 'style' | 'placeholderTextColor' | 'ref'> {
  ref?: Ref<TextInputInstance>;
  /** Icon shown at the leading edge. */
  icon?: ReactNode;
  /** Element at the trailing edge, e.g. a show/hide password toggle. */
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Frosted-glass text field with an optional leading icon and trailing accessory. */
export function AppInput({ ref, icon, trailing, style, ...inputProps }: AppInputProps) {
  const { colors, typography } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  const textStyle = useMemo(
    () => scaleTextStyle(typography.variants.input, scale),
    [typography, scale],
  );

  return (
    <View style={[styles.field, style]}>
      {icon && <View style={[styles.slot, styles.leadingSlot]}>{icon}</View>}
      <TextInput
        ref={ref}
        placeholderTextColor={colors.textOnGlassMuted}
        selectionColor={colors.textOnGlassStrong}
        maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER}
        {...inputProps}
        style={[textStyle, styles.input, icon ? styles.inputAfterIcon : styles.inputAlone]}
      />
      {trailing && <View style={[styles.slot, styles.trailingSlot]}>{trailing}</View>}
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  field: {
    height: scale(FIELD_HEIGHT),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scale(borderRadius.control),
    borderWidth: scale(BORDER_WIDTH),
    borderColor: colors.glassFieldBorder,
    backgroundColor: colors.glassFieldFill,
  },
  slot: {
    width: scale(SLOT_WIDTH),
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadingSlot: {
    marginLeft: scale(LEADING_SLOT_INSET),
  },
  trailingSlot: {
    marginRight: scale(TRAILING_SLOT_INSET),
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    paddingVertical: 0,
    color: colors.textOnGlass,
    textAlignVertical: 'center',
    // Web draws a focus ring that native fields don't have; the design shows none.
    // ('solid' at width 0, because browsers ignore the width of their default 'auto' ring.)
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  inputAfterIcon: {
    marginLeft: scale(TEXT_INSET_AFTER_ICON),
  },
  inputAlone: {
    marginLeft: scale(TEXT_INSET_WITHOUT_ICON),
  },
}));
