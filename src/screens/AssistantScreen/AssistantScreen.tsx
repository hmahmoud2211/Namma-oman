import { useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ModeSwitch,
  ResidentChip,
  type AssistantHealthState,
  type AssistantMode,
} from '@/components/assistant/AssistantToolbar';
import { FadeSwap } from '@/components/assistant/FadeSwap';
import type { IntentMeta } from '@/components/assistant/insights';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { useAccountMenu } from '@/components/layout/AccountMenu';
import { MainTabBar } from '@/components/layout/MainTabBar';
import { PageHeader } from '@/components/layout/PageHeader';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { OptionList, type ListOption } from '@/components/ui/OptionList';
import { assistantStrings } from '@/constants/assistantStrings';
import { images } from '@/constants/images';
import { resident as signedInResident } from '@/constants/resident';
import { useAppState } from '@/hooks/useAppState';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAssistantChat } from '@/hooks/useAssistantChat';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import type { AssistantResident } from '@/services/assistant/assistant.types';
import { fetchHealth, fetchResidents } from '@/services/assistant/assistantApi';
import type { RootStackScreenProps } from '@/types/navigation.types';

import { ChatPanel } from './ChatPanel';
import { useAssistantPageStyles } from './AssistantScreen.styles';
import { VoicePanel } from './VoicePanel';

const GUEST_ID = 'guest';
const NEW_CHAT_ID = 'new-chat';
const residentOptionId = (id: number) => `resident-${id}`;
/** Slide distance when switching between chat and voice, in design dp. */
const PANE_SHIFT = 22;

/**
 * The assistant (migrated from the Parklane app): text chat over REST and a realtime voice
 * conversation over WebSocket, both answered from the building's live data. Answers about a
 * topic with a screen here (parking, visitors, maintenance, community, smart home) link to it.
 */
export function AssistantScreen({ navigation, route }: RootStackScreenProps<'Assistant'>) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { locale, isRTL } = useLocale();
  const { scale } = useResponsive();
  const copy = assistantStrings[locale];
  const { residentId, setResidentId } = useAppState();
  const account = useAccountMenu();

  const [mode, setMode] = useState<AssistantMode>(route.params?.mode ?? 'chat');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [residents, setResidents] = useState<readonly AssistantResident[]>([]);
  const [health, setHealth] = useState<AssistantHealthState>('checking');
  const [keyboardShown, setKeyboardShown] = useState(false);
  const chat = useAssistantChat(residentId);
  const resetChat = chat.reset;

  const styleParams = useMemo(() => ({ insets, keyboardShown }), [insets, keyboardShown]);
  const styles = useAssistantPageStyles(styleParams);

  // While typing, the tab bar steps aside so the composer sits right above the keyboard.
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const shown = Keyboard.addListener(showEvent, () => setKeyboardShown(true));
    const hidden = Keyboard.addListener(hideEvent, () => setKeyboardShown(false));
    return () => {
      shown.remove();
      hidden.remove();
    };
  }, []);

  const probeHealth = useCallback((signal?: AbortSignal) => {
    fetchHealth(signal)
      .then((result) => setHealth(result.db?.db_ok ? 'online' : 'degraded'))
      .catch(() => {
        if (!signal?.aborted) {
          setHealth('offline');
        }
      });
  }, []);

  const retryHealth = useCallback(() => {
    setHealth('checking');
    probeHealth();
  }, [probeHealth]);

  useEffect(() => {
    const controller = new AbortController();
    probeHealth(controller.signal);
    fetchResidents(controller.signal)
      .then(setResidents)
      .catch(() => undefined);
    return () => controller.abort();
  }, [probeHealth]);

  // Opening the screen again with `mode: 'voice'` lands in voice. Adjusted during render, as
  // React recommends for state that follows a prop.
  const requestedMode = route.params?.mode;
  const [lastRequestedMode, setLastRequestedMode] = useState(requestedMode);
  if (requestedMode !== lastRequestedMode) {
    setLastRequestedMode(requestedMode);
    if (requestedMode) {
      setMode(requestedMode);
    }
  }

  const resident = residents.find((entry) => entry.residentId === residentId);
  const residentName = resident?.name ?? (residentId != null ? copy.resident(residentId) : null);

  const openRoute = useCallback(
    (target: NonNullable<IntentMeta['route']>) => navigation.navigate(target),
    [navigation],
  );
  const openPicker = useCallback(() => setPickerOpen(true), []);
  const showVoice = useCallback(() => setMode('voice'), []);

  const pickerOptions = useMemo<ListOption[]>(
    () => [
      {
        id: NEW_CHAT_ID,
        label: copy.newConversation,
        icon: { set: 'ionicons', name: 'create-outline' },
      },
      ...residents.map((entry) => ({
        id: residentOptionId(entry.residentId),
        label: entry.name,
        description: entry.unitCode,
        icon: { set: 'ionicons', name: 'person-outline' } as const,
      })),
      { id: GUEST_ID, label: copy.guest, icon: { set: 'ionicons', name: 'person-remove-outline' } },
    ],
    [copy, residents],
  );

  const handlePick = useCallback(
    (option: ListOption) => {
      if (option.id === NEW_CHAT_ID) {
        resetChat();
        setMode('chat');
        return;
      }
      if (option.id === GUEST_ID) {
        setResidentId(null);
        return;
      }
      const picked = residents.find((entry) => residentOptionId(entry.residentId) === option.id);
      if (picked) {
        setResidentId(picked.residentId);
      }
    },
    [resetChat, residents, setResidentId],
  );

  return (
    <ScreenWrapper
      background={images.homeBackground}
      backgroundTint={colors.backgroundTint}
      keyboardAvoiding
      overlay={
        <>
          {keyboardShown ? null : <MainTabBar />}
          {pickerOpen ? (
            <BottomSheet title={copy.residentMenuTitle} onClose={() => setPickerOpen(false)}>
              {(close) => (
                <OptionList
                  options={pickerOptions}
                  selectedId={residentId != null ? residentOptionId(residentId) : GUEST_ID}
                  onSelect={(option) => {
                    close();
                    handlePick(option);
                  }}
                />
              )}
            </BottomSheet>
          ) : null}
          {account.menu}
        </>
      }
    >
      <View style={styles.page}>
        <PageHeader
          initials={signedInResident.initials}
          onProfilePress={account.open}
          avatarRef={account.avatarRef}
        />

        <View style={styles.column}>
          <AppText variant="pageOverline" color={colors.accent} accessibilityRole="header">
            {copy.overline}
          </AppText>

          <View style={styles.toolbar}>
            <ResidentChip
              name={residentName}
              unitCode={resident?.unitCode}
              health={health}
              onPress={openPicker}
              style={styles.residentChip}
            />
            <ModeSwitch mode={mode} onChange={setMode} style={styles.modeSwitch} />
          </View>

          {health === 'offline' ? (
            <FadeSwap swapKey="offline" rise={-scale(6)}>
              <View style={styles.banner} accessibilityRole="alert">
                <AppIcon
                  set="ionicons"
                  name="cloud-offline-outline"
                  size={scale(12)}
                  color={colors.chipDangerText}
                />
                <AppText variant="label" color={colors.chipDangerText} style={styles.bannerText}>
                  {copy.offline}
                </AppText>
                <Pressable
                  onPress={retryHealth}
                  hitSlop={scale(8)}
                  accessibilityRole="button"
                  style={({ pressed }) => pressed && styles.pressed}
                >
                  <AppText variant="panelLabel" color={colors.textPrimary}>
                    {copy.retry}
                  </AppText>
                </Pressable>
              </View>
            </FadeSwap>
          ) : null}

          {/* Keyed by mode, so each switch slides the new pane in. Voice unmounts when left,
              which ends its call. */}
          <FadeSwap
            key={mode}
            swapKey={mode}
            rise={0}
            shift={scale(mode === 'voice' ? PANE_SHIFT : -PANE_SHIFT) * (isRTL ? -1 : 1)}
            duration={360}
            style={styles.pane}
          >
            {mode === 'chat' ? (
              <ChatPanel
                messages={chat.messages}
                pending={chat.pending}
                residentName={resident?.name ?? null}
                onSend={chat.send}
                onRetry={chat.retry}
                onVoice={showVoice}
                onSignIn={openPicker}
                onOpenRoute={openRoute}
              />
            ) : (
              <VoicePanel residentId={residentId} onSignIn={openPicker} onOpenRoute={openRoute} />
            )}
          </FadeSwap>
        </View>
      </View>
    </ScreenWrapper>
  );
}
