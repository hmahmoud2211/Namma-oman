import { useCameraPermissions } from 'expo-camera';
import { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';

import { AssistantOrb, moodForPhase } from '@/components/assistant/AssistantOrb';
import { CameraPeek, type CameraPeekHandle } from '@/components/assistant/CameraPeek';
import { FadeSwap } from '@/components/assistant/FadeSwap';
import type { IntentMeta } from '@/components/assistant/insights';
import { VoiceControls } from '@/components/assistant/VoiceControls';
import { VoiceStatusPill } from '@/components/assistant/VoiceStatusPill';
import { VoiceTranscript } from '@/components/assistant/VoiceTranscript';
import { AppText } from '@/components/common/AppText';
import { assistantStrings, voiceErrorText, voiceExamples } from '@/constants/assistantStrings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { useVoiceSession, type VoicePhase } from '@/hooks/useVoiceSession';

import {
  COMPACT_HEIGHT,
  VOICE_ORB,
  VOICE_ORB_COMPACT,
  useAssistantStyles,
} from './AssistantScreen.styles';

interface VoicePanelProps {
  residentId: number | null;
  onSignIn: () => void;
  onOpenRoute: (route: NonNullable<IntentMeta['route']>) => void;
}

/** Phases where a tap on the orb cuts the assistant off. */
const INTERRUPTIBLE: readonly VoicePhase[] = ['speaking', 'thinking', 'searching', 'looking'];

/**
 * The realtime conversation: the orb, live captions and call controls, with an optional camera
 * the assistant can look through. Leaving voice mode unmounts this panel, which hangs up.
 */
export function VoicePanel({ residentId, onSignIn, onOpenRoute }: VoicePanelProps) {
  const styles = useAssistantStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const { height } = useWindowDimensions();
  const copy = assistantStrings[locale];
  const orbSize = scale(height < COMPACT_HEIGHT ? VOICE_ORB_COMPACT : VOICE_ORB);

  const [cameraOn, setCameraOn] = useState(false);
  const [cameraNotice, setCameraNotice] = useState<string | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const camera = useRef<CameraPeekHandle>(null);
  const captureFrame = useCallback(() => camera.current?.capture() ?? Promise.resolve(''), []);

  const session = useVoiceSession({ residentId, cameraEnabled: cameraOn, captureFrame });
  const { phase } = session;
  const inCall = phase !== 'idle' && phase !== 'error';

  const toggleCamera = useCallback(async () => {
    setCameraNotice(null);
    if (cameraOn) {
      setCameraOn(false);
      return;
    }
    const granted = cameraPermission?.granted || (await requestCameraPermission()).granted;
    if (!granted) {
      setCameraNotice(assistantStrings[locale].cameraDenied);
      return;
    }
    setCameraOn(true);
  }, [cameraOn, cameraPermission?.granted, locale, requestCameraPermission]);

  const onOrbPress = useCallback(() => {
    if (phase === 'idle' || phase === 'error') {
      session.start();
    } else if (INTERRUPTIBLE.includes(phase)) {
      session.interrupt();
    }
  }, [phase, session]);

  const hint =
    phase === 'error'
      ? { text: voiceErrorText(session.error, locale), error: true }
      : phase === 'idle'
        ? { text: copy.hintIdle }
        : phase === 'connecting'
          ? { text: copy.hintConnecting }
          : phase === 'listening' || phase === 'hearing'
            ? { text: copy.hintListening }
            : {
                text: session.duplex === 'duplex' ? copy.interruptDuplex : copy.interruptHalfDuplex,
              };

  return (
    <View style={styles.voice}>
      <VoiceStatusPill phase={phase} queryFn={session.queryFn} muted={session.muted} />

      <Pressable
        onPress={onOrbPress}
        accessibilityRole="button"
        accessibilityLabel={
          inCall
            ? INTERRUPTIBLE.includes(phase)
              ? copy.interruptAssistant
              : copy.assistantName
            : copy.startVoice
        }
        style={styles.voiceOrb}
      >
        <AssistantOrb size={orbSize} mood={moodForPhase(phase)} level={session.level} />
      </Pressable>

      <FadeSwap swapKey={hint.text} style={styles.voiceHint}>
        <AppText
          variant="chatBody"
          align="center"
          color={'error' in hint ? colors.destructiveText : colors.textOnBackgroundMuted}
        >
          {hint.text}
        </AppText>
      </FadeSwap>

      {cameraNotice ? (
        <AppText
          variant="label"
          align="center"
          color={colors.statusWarning}
          style={styles.voiceNotice}
        >
          {cameraNotice}
        </AppText>
      ) : null}

      {session.turns.length > 0 ? (
        <VoiceTranscript
          turns={session.turns}
          onOpenRoute={onOpenRoute}
          onSignIn={onSignIn}
          style={styles.voiceTranscript}
        />
      ) : (
        // Scrolls when the intro is taller than the room between the orb and the controls.
        <ScrollView
          style={styles.voiceTranscript}
          contentContainerStyle={styles.voiceIntroContent}
          showsVerticalScrollIndicator={false}
        >
          <FadeSwap swapKey={inCall ? 'live' : 'idle'} style={styles.voiceIntro}>
            {inCall ? null : (
              <>
                <AppText variant="panelTitle" align="center">
                  {copy.voiceIdleTitle}
                </AppText>
                <AppText
                  variant="label"
                  align="center"
                  color={colors.textOnBackgroundMuted}
                  style={styles.voiceIntroBody}
                >
                  {copy.voiceIdleBody}
                </AppText>
              </>
            )}
            <AppText
              variant="labelSmall"
              align="center"
              color={colors.textOnBackgroundSubtle}
              style={styles.voiceTry}
            >
              {copy.voiceTryLabel}
            </AppText>
            <View style={styles.voiceExamples}>
              {voiceExamples.map((example) => (
                <View key={example} style={styles.voiceExample}>
                  <AppText variant="label" color={colors.accent}>
                    {`“${example}”`}
                  </AppText>
                </View>
              ))}
            </View>
            <AppText
              variant="labelSmall"
              align="center"
              color={colors.textOnBackgroundSubtle}
              style={styles.voiceNote}
            >
              {copy.voiceLanguageNote}
            </AppText>
          </FadeSwap>
        </ScrollView>
      )}

      <VoiceControls
        inCall={inCall}
        muted={session.muted}
        cameraOn={cameraOn}
        onStart={session.start}
        onEnd={session.stop}
        onToggleMute={session.toggleMute}
        onToggleCamera={() => void toggleCamera()}
        style={styles.voiceControls}
      />

      {cameraOn ? (
        <CameraPeek ref={camera} scanning={phase === 'looking'} style={styles.camera} />
      ) : null}
    </View>
  );
}
