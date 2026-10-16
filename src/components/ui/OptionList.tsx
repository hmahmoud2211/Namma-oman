import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { AppIcon, type Glyph } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

export interface ListOption {
  id: string;
  label: string;
  description?: string;
  icon?: Glyph;
  /** Shown in the warning colour (e.g. "Cancel pass"). */
  destructive?: boolean;
}

interface OptionListProps {
  options: readonly ListOption[];
  selectedId?: string;
  onSelect: (option: ListOption) => void;
  /** Shown when there is nothing to choose (e.g. no times left today). */
  emptyLabel?: string;
  /** Radio rows (a choice) or plain rows (a command). */
  kind?: 'radio' | 'menu';
  header?: ReactNode;
}

/** Design dp, matching the rows of the Construction Progress unit picker. */
const d = { rowHeight: 34, paddingX: 9, radius: 8, icon: 13, gap: 8, check: 10 } as const;

/** The rows of a choice or command sheet (see `useInnerScreen().pickOption`). */
export function OptionList({
  options,
  selectedId,
  onSelect,
  emptyLabel,
  kind = 'radio',
  header,
}: OptionListProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();

  return (
    <View accessibilityRole={kind === 'radio' ? 'radiogroup' : 'menu'}>
      {header}
      {options.length === 0 && emptyLabel ? (
        <AppText variant="labelLarge" color={colors.surfaceTextMuted} style={styles.empty}>
          {emptyLabel}
        </AppText>
      ) : null}
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        const color = option.destructive ? colors.destructiveText : colors.surfaceText;
        return (
          <Pressable
            key={option.id}
            onPress={() => onSelect(option)}
            accessibilityRole={kind === 'radio' ? 'radio' : 'menuitem'}
            accessibilityState={kind === 'radio' ? { checked: isSelected } : undefined}
            accessibilityLabel={
              option.description ? `${option.label}. ${option.description}` : option.label
            }
            style={({ pressed }) => [
              styles.row,
              isSelected && styles.rowSelected,
              pressed && styles.pressed,
            ]}
          >
            {option.icon && (
              <AppIcon
                {...option.icon}
                size={scale(d.icon)}
                color={option.destructive ? colors.destructiveText : colors.surfaceIcon}
              />
            )}
            <View style={styles.text}>
              <AppText variant="value" color={color} numberOfLines={1}>
                {option.label}
              </AppText>
              {option.description ? (
                <AppText variant="label" color={colors.surfaceTextMuted} numberOfLines={2}>
                  {option.description}
                </AppText>
              ) : null}
            </View>
            {isSelected && <CheckIcon size={scale(d.check)} color={colors.surfaceIcon} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles(({ colors }, { scale }) => ({
  row: {
    minHeight: scale(d.rowHeight),
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(d.gap),
    paddingHorizontal: scale(d.paddingX),
    paddingVertical: scale(4),
    borderRadius: scale(d.radius),
  },
  rowSelected: {
    backgroundColor: colors.menuActiveFill,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    flex: 1,
  },
  empty: {
    paddingVertical: scale(10),
    textAlign: 'center',
  },
}));
