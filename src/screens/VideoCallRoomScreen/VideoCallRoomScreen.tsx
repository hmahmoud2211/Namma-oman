import { useNavigation } from '@react-navigation/native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { CircleButton } from '@/components/common/CircleButton';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { meetConfig } from '@/constants/meetConfig';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useMeetCall } from '@/hooks/useMeetCall';
import { useResponsive } from '@/hooks/useResponsive';
import { useToast } from '@/hooks/useToast';
import type { CallMember, CallSnapshot } from '@/services/meet/MeetCall';
import { shareInvite } from '@/services/meet/shareInvite';
import type { RootStackScreenProps } from '@/types/navigation.types';

import { meetErrorMessage, videoCallContent } from '../VideoCallScreen/VideoCallScreen.data';
import { CallTile } from './CallTile';
import { CallAudio } from './CallVideo';
import { callRoomContent } from './VideoCallRoomScreen.data';
import { roomDesign, useCallRoomStyles } from './VideoCallRoomScreen.styles';

interface GridTile {
  key: string;
  member: CallMember;
  isScreen: boolean;
}

/** In a call: everyone's camera in a grid, shared screens first, and the call controls. */
export function VideoCallRoomScreen({ route }: RootStackScreenProps<'VideoCallRoom'>) {
  const { code, name } = route.params;
  const navigation = useNavigation();
  const styles = useCallRoomStyles();
  const { colors, artwork } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const { showToast } = useToast();
  const copy = callRoomContent[locale];
  useCallKeepAwake();

  const { call, phase, snapshot } = useMeetCall(code, name);
  const [stage, setStage] = useState({ width: 0, height: 0 });

  const leave = useCallback(() => {
    // Unmounting hangs up (useMeetCall); a dev launch has nothing to go back to.
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('VideoCall');
  }, [navigation]);

  const handleInvite = useCallback(() => {
    const formatted = snapshot?.formattedCode ?? code;
    const link = `${meetConfig.baseUrl}/?call=${code}`;
    void shareInvite(copy.inviteMessage(formatted, link), copy.inviteSubject).then((result) => {
      if (result === 'copied') showToast({ title: copy.inviteCopied });
    });
  }, [code, copy, showToast, snapshot?.formattedCode]);

  const handleFlip = useCallback(async () => {
    if (!call) return;
    try {
      const facing = await call.flipCamera();
      showToast({ title: facing === 'environment' ? copy.rearCamera : copy.frontCamera });
    } catch {
      // No other camera (laptops, tablets, simulators): the current one keeps running.
      showToast({ title: copy.noOtherCamera });
    }
  }, [call, copy.frontCamera, copy.noOtherCamera, copy.rearCamera, showToast]);

  const openInBrowser = useCallback(() => {
    void Linking.openURL(`${meetConfig.baseUrl}/?call=${code}`).catch(() => undefined);
  }, [code]);

  const handleStageLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setStage({ width: nativeEvent.layout.width, height: nativeEvent.layout.height });
  }, []);

  const tiles = useMemo(() => gridTiles(snapshot), [snapshot]);
  const columns = tiles.length <= 2 ? 1 : 2;
  const rows = Math.max(1, Math.ceil(tiles.length / columns));
  const gap = scale(roomDesign.gridGap);
  const tileWidth = (stage.width - gap * (columns - 1)) / columns;
  // Fill the stage; past a few rows the grid scrolls instead of shrinking tiles to stamps.
  const tileHeight = Math.max(
    (stage.height - gap * (rows - 1)) / rows,
    scale(roomDesign.minTileHeight),
  );
  const gridScrolls = tileHeight * rows + gap * (rows - 1) > stage.height + 1;

  const problem = snapshot?.problem ? copy.problems[snapshot.problem] : null;
  const header = (
    <View style={styles.header}>
      <CircleButton
        size={roomDesign.headerButton}
        borderColor={colors.headerButtonBorder}
        accessibilityLabel={copy.back}
        onPress={leave}
      >
        <ChevronIcon size={scale(12)} color={colors.headerIcon} direction="left" />
      </CircleButton>
      <View style={styles.headerText}>
        <AppText variant="cardTitle" numberOfLines={1} style={styles.code}>
          {snapshot?.formattedCode ?? code}
        </AppText>
        {snapshot ? (
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                snapshot.status === 'connected' && styles.statusGood,
                (snapshot.status === 'failed' || snapshot.status === 'ended') && styles.statusBad,
              ]}
            />
            <AppText variant="label" color={colors.textOnBackgroundMuted} numberOfLines={1}>
              {`${copy.status[snapshot.status]} · ${copy.people(snapshot.members.length, snapshot.maxParticipants)}`}
            </AppText>
          </View>
        ) : null}
      </View>
      <CircleButton
        size={roomDesign.headerButton}
        borderColor={colors.headerButtonBorder}
        accessibilityLabel={copy.invite}
        onPress={handleInvite}
      >
        <AppIcon
          set="ionicons"
          name="person-add-outline"
          size={scale(13)}
          color={colors.headerIcon}
        />
      </CircleButton>
    </View>
  );

  if (phase.kind === 'failed') {
    const message =
      phase.reason === 'unavailable'
        ? Platform.OS === 'web'
          ? videoCallContent[locale].browserUnsupported
          : copy.unavailable
        : phase.reason === 'media'
          ? copy.mediaDenied
          : phase.reason === 'join'
            ? meetErrorMessage(phase.error, locale)
            : copy.problems.connectFailed;
    return (
      <ScreenWrapper background={artwork.homeBackground} backgroundTint={colors.backgroundTint}>
        <View style={styles.content}>
          {header}
          <View style={styles.centered}>
            <AppText variant="bodyLarge" align="center" style={styles.message}>
              {message}
            </AppText>
            {phase.reason === 'unavailable' ? (
              <AppButton
                title={copy.openInBrowser}
                variant="emerald"
                size="medium"
                onPress={openInBrowser}
                style={styles.messageButton}
              />
            ) : phase.reason === 'media' ? (
              <AppButton
                title={copy.openSettings}
                variant="surface"
                size="medium"
                onPress={() => void Linking.openSettings()}
                style={styles.messageButton}
              />
            ) : null}
            <AppButton
              title={copy.backToLobby}
              variant="outline"
              size="medium"
              onPress={leave}
              style={styles.messageButton}
            />
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper background={artwork.homeBackground} backgroundTint={colors.backgroundTint}>
      <View style={styles.content}>
        {header}
        {problem ? (
          <AppText
            variant="label"
            color={colors.chipDangerText}
            style={styles.problem}
            accessibilityLiveRegion="polite"
          >
            {problem}
          </AppText>
        ) : null}

        <View style={styles.stage} onLayout={handleStageLayout}>
          {/* Everyone else's sound (the web needs an element per track; native plays it). */}
          {snapshot?.members.flatMap((member) =>
            member.audio.map((track) => <CallAudio key={track.id} track={track} />),
          )}
          {!snapshot ? (
            <View style={styles.centered}>
              <ActivityIndicator color={colors.accent} />
              <AppText variant="bodyLarge" align="center" style={styles.message}>
                {copy.joining}
              </AppText>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.grid}
              scrollEnabled={gridScrolls}
              showsVerticalScrollIndicator={false}
            >
              {tiles.map(({ key, member, isScreen }) => (
                <CallTile
                  key={key}
                  name={member.name || copy.guest}
                  label={tileLabel(member, isScreen, copy)}
                  track={isScreen ? member.screen : member.camera}
                  isScreen={isScreen}
                  mirror={member.isSelf && !isScreen && snapshot.facing === 'user'}
                  cameraOn={member.state.cam}
                  micOn={member.state.mic}
                  speaking={!isScreen && member.state.speaking && member.state.mic}
                  style={{ width: tileWidth, height: tileHeight }}
                />
              ))}
              {snapshot.members.length === 1 ? (
                <AppText
                  variant="label"
                  color={colors.textOnBackgroundMuted}
                  align="center"
                  style={styles.waiting}
                >
                  {copy.waiting}
                </AppText>
              ) : null}
            </ScrollView>
          )}
        </View>

        <View style={styles.controls}>
          <ControlButton
            icon={snapshot?.mic === false ? 'mic-off' : 'mic-outline'}
            label={snapshot?.mic === false ? copy.unmute : copy.mute}
            active={snapshot?.mic === false}
            danger
            disabled={!snapshot?.hasMic}
            onPress={() => call && snapshot && call.setMic(!snapshot.mic)}
          />
          <ControlButton
            icon={snapshot?.cam === false ? 'videocam-off-outline' : 'videocam-outline'}
            label={snapshot?.cam === false ? copy.cameraOn : copy.cameraOff}
            active={snapshot?.cam === false}
            danger
            disabled={!snapshot?.hasCamera}
            onPress={() => call && snapshot && call.setCamera(!snapshot.cam)}
          />
          <ControlButton
            icon="camera-reverse-outline"
            label={copy.flip}
            active={false}
            disabled={!snapshot?.hasCamera || snapshot?.cam === false}
            onPress={() => void handleFlip()}
          />
          <View style={styles.controlCell}>
            <Pressable
              onPress={leave}
              accessibilityRole="button"
              accessibilityLabel={copy.back}
              style={({ pressed }) => [styles.endButton, pressed && styles.pressed]}
            >
              <LinearGradient
                colors={colors.callEndGradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <AppIcon
                set="ionicons"
                name="call"
                size={scale(roomDesign.controlIcon)}
                color={colors.white}
                style={styles.endGlyph}
              />
            </Pressable>
            <AppText variant="label" color={colors.textOnBackgroundMuted} style={styles.controlLabel}>
              {copy.leave}
            </AppText>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const KEEP_AWAKE_TAG = 'video-call';

/**
 * Keeps the screen on for the whole call. Both calls can reject on web (no wake lock, or leaving
 * before the browser granted it); either way the call carries on, so they're caught.
 */
function useCallKeepAwake() {
  useEffect(() => {
    activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => undefined);
    return () => {
      deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => undefined);
    };
  }, []);
}

function ControlButton({
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
  const styles = useCallRoomStyles();
  return (
    <View style={styles.controlCell}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled, selected: active }}
        accessibilityLabel={label}
        style={({ pressed }) => [
          styles.control,
          active && (danger ? styles.controlDanger : styles.controlActive),
          disabled && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        <AppIcon
          set="ionicons"
          name={icon}
          size={scale(roomDesign.controlIcon)}
          color={active ? (danger ? colors.chipDangerText : colors.accent) : colors.textPrimary}
        />
      </Pressable>
      <AppText
        variant="label"
        color={colors.textOnBackgroundMuted}
        numberOfLines={1}
        style={styles.controlLabel}
      >
        {label}
      </AppText>
    </View>
  );
}

/** Shared screens lead (they're what people are looking at), then everyone's camera. */
function gridTiles(snapshot: CallSnapshot | null): GridTile[] {
  if (!snapshot) return [];
  const screens = snapshot.members
    .filter((member) => member.screen)
    .map((member) => ({ key: `${member.id}:screen`, member, isScreen: true }));
  const cameras = snapshot.members.map((member) => ({
    key: `${member.id}:camera`,
    member,
    isScreen: false,
  }));
  return [...screens, ...cameras];
}

function tileLabel(
  member: CallMember,
  isScreen: boolean,
  copy: (typeof callRoomContent)['en'],
) {
  const name = member.isSelf ? copy.you : member.name || copy.guest;
  return isScreen ? copy.screenOf(name) : name;
}
