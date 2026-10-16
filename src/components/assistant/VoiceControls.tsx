import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { assistantStrings } from '@/constants/assistantStrings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

interface VoiceControlsProps {
  /** A call is connecting or connected: the main button hangs up. */
  inCall: boolean;
  muted: boolean;
  cameraOn: boolean;
  onStart: () => void;
  onEnd: () => void;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Design dp. */
const d = { main: 54, side: 38, mainIcon: 21, sideIcon: 16, gap: 26, labelGap: 5 } as const;

/**
 * Camera, call and mute. The call button morphs from a gold "start" into a coral hang-up,
 * its handset turning as it goes.
 */
export function VoiceControls({
  inCall,
  muted,
  cameraOn,
  onStart,
  onEnd,
  onToggleMute,
  onToggleCamera,
  style,
}: VoiceControlsProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const reduce = useReduceMotion();
  const copy = assistantStrings[locale];

  const [morph] = useState(() => new Animated.Value(inCall ? 1 : 0));
  useEffect(() => {
    const spring = Animated.spring(morph, {
      toValue: inCall ? 1 : 0,
      damping: 15,
      stiffness: 180,
      useNativeDriver: true,
    });
    spring.start();
    return () => spring.stop();
  }, [inCall, morph]);

  // An inviting ring ripples out of the start button while it waits.
  const [invite] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (inCall || reduce) {
      invite.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.timing(invite, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [inCall, invite, reduce]);

  return (
    <View style={[styles.row, style]}>
      <SideButton
        icon={cameraOn ? 'camera' : 'camera-outline'}
        label={cameraOn ? copy.cameraOn : copy.camera}
        active={cameraOn}
        onPress={onToggleCamera}
      />

      <View style={styles.mainCell}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.invite,
            {
              opacity: invite.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
              transform: [
                { scale: invite.interpolate({ inputRange: [0, 1], outputRange: [1, 1.55] }) },
              ],
            },
          ]}
        />
        <Pressable
          onPress={inCall ? onEnd : onStart}
          accessibilityRole="button"
          accessibilityLabel={inCall ? copy.endVoice : copy.startVoice}
          style={({ pressed }) => [styles.main, pressed && styles.pressed]}
        >
          <LinearGradient
            colors={colors.callStartGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: morph }]}>
            <LinearGradient
              colors={colors.callEndGradient}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: morph.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '135deg'],
                  }),
                },
              ],
            }}
          >
            <AppIcon
              set="ionicons"
              name={inCall ? 'call' : 'mic'}
              size={scale(d.mainIcon)}
              color={inCall ? colors.white : colors.callGlyph}
            />
          </Animated.View>
        </Pressable>
        <AppText variant="label" color={colors.textOnBackgroundMuted} style={styles.label}>
          {inCall ? copy.end : copy.start}
        </AppText>
      </View>

      <SideButton
        icon={muted ? 'mic-off' : 'mic-outline'}
        label={muted ? copy.unmute : copy.mute}
        active={muted}
        danger={muted}
        disabled={!inCall}
        onPress={onToggleMute}
      />
    </View>
  );
}

function SideButton({
  icon,
  label,
  active,
  danger = false,
  disabled = false,
  onPress,
}: {
  icon: string;
  label: string;
  active: boolean;
  danger?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  return (
    <View style={styles.sideCell}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="switch"
        accessibilityState={{ checked: active, disabled }}
        accessibilityLabel={label}
        style={({ pressed }) => [
          styles.side,
          active && (danger ? styles.sideDanger : styles.sideActive),
          disabled && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        <AppIcon
          set="ionicons"
          name={icon}
          size={scale(d.sideIcon)}
          color={active ? (danger ? colors.chipDangerText : colors.accent) : colors.textPrimary}
        />
      </Pressable>
      <AppText variant="label" color={colors.textOnBackgroundMuted} style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    columnGap: scale(d.gap),
  },
  mainCell: {
    alignItems: 'center',
  },
  sideCell: {
    alignItems: 'center',
    paddingTop: scale((d.main - d.side) / 2),
  },
  main: {
    width: scale(d.main),
    height: scale(d.main),
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scale(0.8),
    borderColor: colors.homeHaloBorder,
  },
  invite: {
    position: 'absolute',
    top: 0,
    width: scale(d.main),
    height: scale(d.main),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.homeDiscGlow,
  },
  side: {
    width: scale(d.side),
    height: scale(d.side),
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.controlFill,
    borderWidth: scale(0.6),
    borderColor: colors.controlBorder,
  },
  sideActive: {
    backgroundColor: colors.controlActiveFill,
    borderColor: colors.accent,
  },
  sideDanger: {
    backgroundColor: colors.chipDangerFill,
    borderColor: colors.chipDangerBorder,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    marginTop: scale(d.labelGap),
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.94 }],
  },
}));
