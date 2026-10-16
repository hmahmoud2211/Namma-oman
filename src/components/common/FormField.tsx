import { useMemo, type ReactNode, type Ref } from 'react';
import {
  Pressable,
  TextInput,
  View,
  type StyleProp,
  type TextInputInstance,
  type TextInputProps,
  type ViewInstance,
  type ViewStyle,
} from 'react-native';

import { AppIcon, type Glyph } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';
import { scaleTextStyle } from '@/utils/textStyle';

/** Design dp, sized to the Construction Progress cards' type. */
const d = {
  height: 29,
  multilineHeight: 64,
  radius: 7.7,
  borderWidth: 0.6,
  paddingX: 8,
  icon: 12,
  iconGap: 6,
  labelGap: 3,
  errorGap: 2,
  chevron: 9,
} as const;
const MAX_FONT_SIZE_MULTIPLIER = 1.3;

interface FieldFrameProps {
  label: string;
  error?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Label above, the field, and its message below. */
function FieldFrame({ label, error, children, style }: FieldFrameProps) {
  const { colors } = useAppTheme();
  const styles = useStyles();
  return (
    <View style={style}>
      <AppText
        variant="label"
        color={colors.surfaceTextMuted}
        style={styles.label}
        numberOfLines={1}
      >
        {label}
      </AppText>
      {children}
      {error ? (
        <AppText
          variant="label"
          color={colors.destructiveText}
          style={styles.error}
          accessibilityLiveRegion="polite"
        >
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

export interface TextFieldProps extends Omit<
  TextInputProps,
  'style' | 'placeholderTextColor' | 'ref'
> {
  label: string;
  icon?: Glyph;
  error?: string;
  ref?: Ref<TextInputInstance>;
  style?: StyleProp<ViewStyle>;
}

/** A labelled text field on a themed card (forms on the service screens). */
export function TextField({
  label,
  icon,
  error,
  ref,
  style,
  multiline,
  ...inputProps
}: TextFieldProps) {
  const { colors, typography } = useAppTheme();
  const { locale, isRTL } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const textStyle = useMemo(
    () =>
      scaleTextStyle(
        (locale === 'ar' ? typography.arabicVariants : typography.variants).bodyLarge,
        scale,
      ),
    [typography, locale, scale],
  );

  return (
    <FieldFrame label={label} error={error} style={style}>
      <View style={[styles.field, multiline && styles.multiline, !!error && styles.fieldError]}>
        {icon && (
          <AppIcon
            {...icon}
            size={scale(d.icon)}
            color={colors.surfaceIcon}
            style={multiline ? styles.multilineIcon : undefined}
          />
        )}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.fieldPlaceholder}
          selectionColor={colors.surfaceAccentText}
          maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER}
          accessibilityLabel={label}
          multiline={multiline}
          {...inputProps}
          style={[
            textStyle,
            styles.input,
            icon && styles.inputAfterIcon,
            multiline && styles.inputMultiline,
            // Native inputs align to the physical left unless told otherwise.
            { textAlign: isRTL ? 'right' : 'left' },
          ]}
        />
      </View>
    </FieldFrame>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  placeholder: string;
  icon?: Glyph;
  error?: string;
  /** Opens the list of choices (see `useInnerScreen().pickOption`). */
  onPress: () => void;
  ref?: Ref<ViewInstance>;
  style?: StyleProp<ViewStyle>;
}

/** A labelled field that opens a list of choices instead of the keyboard. */
export function SelectField({
  label,
  value,
  placeholder,
  icon,
  error,
  onPress,
  ref,
  style,
}: SelectFieldProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <FieldFrame label={label} error={error} style={style}>
      <Pressable
        ref={ref}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value || placeholder}`}
        style={({ pressed }) => [
          styles.field,
          !!error && styles.fieldError,
          pressed && styles.pressed,
        ]}
      >
        {icon && <AppIcon {...icon} size={scale(d.icon)} color={colors.surfaceIcon} />}
        <AppText
          variant="bodyLarge"
          color={value ? colors.fieldText : colors.fieldPlaceholder}
          numberOfLines={1}
          style={[styles.value, icon && styles.inputAfterIcon]}
        >
          {value || placeholder}
        </AppText>
        <AppIcon
          set="ionicons"
          name="chevron-down"
          size={scale(d.chevron)}
          color={colors.surfaceText}
          style={styles.chevron}
        />
      </Pressable>
    </FieldFrame>
  );
}

const useStyles = makeStyles(({ colors }, { scale }) => ({
  label: {
    marginBottom: scale(d.labelGap),
  },
  error: {
    marginTop: scale(d.errorGap),
  },
  field: {
    height: scale(d.height),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(d.paddingX),
    borderRadius: scale(d.radius),
    borderWidth: scale(d.borderWidth),
    borderColor: colors.fieldBorder,
    backgroundColor: colors.fieldFill,
  },
  multiline: {
    height: scale(d.multilineHeight),
    alignItems: 'flex-start',
    paddingVertical: scale(6),
  },
  multilineIcon: {
    marginTop: scale(1),
  },
  fieldError: {
    borderColor: colors.destructiveText,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    paddingVertical: 0,
    color: colors.fieldText,
    textAlignVertical: 'center',
    // Web draws a focus ring the design doesn't have ('solid' at 0: browsers ignore 'auto').
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  inputMultiline: {
    textAlignVertical: 'top',
  },
  inputAfterIcon: {
    marginStart: scale(d.iconGap),
  },
  value: {
    flex: 1,
  },
  chevron: {
    marginStart: scale(4),
  },
  pressed: {
    opacity: 0.75,
  },
}));
