import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Animated,
  Pressable,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppIcon, type Glyph } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { assistantStrings } from '@/constants/assistantStrings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

export type AssistantMode = 'chat' | 'voice';
export type AssistantHealthState = 'checking' | 'online' | 'degraded' | 'offline';

/** Design dp. */
const d = { height: 28, inset: 3, icon: 11, avatar: 20, light: 6 } as const;

const MODES: readonly { mode: AssistantMode; icon: Glyph }[] = [
  { mode: 'chat', icon: { set: 'ionicons', name: 'chatbubble-ellipses-outline' } },
  { mode: 'voice', icon: { set: 'ionicons', name: 'mic-outline' } },
];

/** Chat / Voice, with a gold pill that springs across to the chosen side. */
export function ModeSwitch({
  mode,
  onChange,
  style,
}: {
  mode: AssistantMode;
  onChange: (mode: AssistantMode) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useAppTheme();
  const { locale, isRTL } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const copy = assistantStrings[locale];
  const [width, setWidth] = useState(0);
  const [position] = useState(() => new Animated.Value(mode === 'voice' ? 1 : 0));
  const segment = width > 0 ? (width - scale(d.inset) * 2) / MODES.length : 0;

  useEffect(() => {
    const spring = Animated.spring(position, {
      toValue: mode === 'voice' ? 1 : 0,
      damping: 18,
      stiffness: 240,
      useNativeDriver: true,
    });
    spring.start();
    return () => spring.stop();
  }, [mode, position]);

  return (
    <View
      style={[styles.track, style]}
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      accessibilityRole="tablist"
    >
      {segment > 0 ? (
        <Animated.View
          style={[
            styles.thumb,
            {
              width: segment,
              transform: [
                {
                  translateX: position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, isRTL ? -segment : segment],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={colors.callStartGradient}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.fill}
          />
        </Animated.View>
      ) : null}
      {MODES.map((option) => {
        const selected = option.mode === mode;
        const label = option.mode === 'chat' ? copy.chatMode : copy.voiceMode;
        const tint = selected ? colors.callGlyph : colors.textOnBackgroundMuted;
        return (
          <Pressable
            key={option.mode}
            onPress={() => onChange(option.mode)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={copy.modeLabel(label)}
            style={styles.option}
          >
            <AppIcon {...option.icon} size={scale(d.icon)} color={tint} />
            <AppText
              variant={selected ? 'tabLabelActive' : 'tabLabel'}
              color={tint}
              style={styles.optionLabel}
            >
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Who the assistant is answering for, with a light for the backend's health. */
export function ResidentChip({
  name,
  unitCode,
  health,
  onPress,
  style,
}: {
  /** `null` for a guest. */
  name: string | null;
  unitCode?: string;
  health: AssistantHealthState;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const copy = assistantStrings[locale];
  const light =
    health === 'online'
      ? colors.statusPositive
      : health === 'degraded'
        ? colors.statusWarning
        : health === 'offline'
          ? colors.destructiveText
          : colors.textOnBackgroundSubtle;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={copy.answeringFor(name ?? copy.guestName)}
      style={({ pressed }) => [styles.chip, pressed && styles.pressed, style]}
    >
      <View>
        <Avatar initials={(name ?? '?').slice(0, 1).toUpperCase()} size={d.avatar} />
        <View style={[styles.light, { backgroundColor: light }]} />
      </View>
      <View style={styles.chipText}>
        <AppText variant="panelLabel" color={colors.textPrimary} numberOfLines={1}>
          {name ?? copy.guestName}
        </AppText>
        <AppText variant="labelTiny" color={colors.textOnBackgroundMuted} numberOfLines={1}>
          {unitCode ?? copy.notSignedIn}
        </AppText>
      </View>
      <AppIcon
        set="ionicons"
        name="chevron-down"
        size={scale(9)}
        color={colors.textOnBackgroundMuted}
      />
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  track: {
    height: scale(d.height),
    flexDirection: 'row',
    padding: scale(d.inset),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.controlFill,
    borderWidth: scale(0.6),
    borderColor: colors.controlBorder,
  },
  thumb: {
    position: 'absolute',
    top: scale(d.inset),
    bottom: scale(d.inset),
    start: scale(d.inset),
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    marginStart: scale(4),
  },
  chip: {
    height: scale(d.height),
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    paddingStart: scale(4),
    paddingEnd: scale(9),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.controlFill,
    borderWidth: scale(0.6),
    borderColor: colors.controlBorder,
  },
  light: {
    position: 'absolute',
    end: -scale(1),
    bottom: -scale(1),
    width: scale(d.light),
    height: scale(d.light),
    borderRadius: borderRadius.pill,
    borderWidth: scale(1),
    borderColor: colors.background,
  },
  chipText: {
    flexShrink: 1,
    marginHorizontal: scale(6),
  },
  pressed: {
    opacity: 0.7,
  },
}));
