import { useRef, useState } from 'react';
import { Pressable, ScrollView, View, type ScrollViewInstance } from 'react-native';

import { AssistantOrb } from '@/components/assistant/AssistantOrb';
import { ChatBubble } from '@/components/assistant/ChatBubble';
import { ChatComposer } from '@/components/assistant/ChatComposer';
import { FadeSwap } from '@/components/assistant/FadeSwap';
import type { IntentMeta } from '@/components/assistant/insights';
import { SuggestionChips } from '@/components/assistant/SuggestionChips';
import { TypingIndicator } from '@/components/assistant/TypingIndicator';
import { AppText } from '@/components/common/AppText';
import { Panel } from '@/components/ui/Panel';
import { assistantStrings, chatSuggestions } from '@/constants/assistantStrings';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { ChatMessage } from '@/hooks/useAssistantChat';
import { useLocale } from '@/hooks/useLocale';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useResponsive } from '@/hooks/useResponsive';

import { WELCOME_ORB, useAssistantStyles } from './AssistantScreen.styles';

interface ChatPanelProps {
  messages: readonly ChatMessage[];
  pending: boolean;
  residentName: string | null;
  onSend: (text: string) => boolean;
  onRetry: (messageId: string) => void;
  onVoice: () => void;
  onSignIn: () => void;
  onOpenRoute: (route: NonNullable<IntentMeta['route']>) => void;
}

/** The text conversation: a welcome card and suggestions, then the thread and composer. */
export function ChatPanel({
  messages,
  pending,
  residentName,
  onSend,
  onRetry,
  onVoice,
  onSignIn,
  onOpenRoute,
}: ChatPanelProps) {
  const styles = useAssistantStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const reduceMotion = useReduceMotion();
  const copy = assistantStrings[locale];
  const scroll = useRef<ScrollViewInstance>(null);
  // Messages already present when the panel opens are history: no entrance.
  const [history] = useState(() => new Set(messages.map((message) => message.id)));
  const empty = messages.length === 0 && !pending;

  return (
    <View style={styles.flex}>
      <ScrollView
        ref={scroll}
        style={styles.flex}
        contentContainerStyle={[styles.thread, empty && styles.threadEmpty]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          if (!empty) {
            scroll.current?.scrollToEnd({ animated: true });
          }
        }}
      >
        {empty ? (
          <View style={styles.welcome}>
            <FadeSwap swapKey="welcome" rise={scale(14)} duration={520}>
              <Panel style={styles.hero}>
                <Pressable
                  onPress={onVoice}
                  accessibilityRole="button"
                  accessibilityLabel={copy.talkToAssistant}
                >
                  <AssistantOrb size={scale(WELCOME_ORB)} mood="idle" />
                </Pressable>
                <View style={styles.heroText}>
                  <AppText variant="labelLarge" color={colors.surfaceTextMuted}>
                    {copy.greeting(residentName)}
                  </AppText>
                  <AppText
                    variant="panelTitle"
                    color={colors.surfaceText}
                    accessibilityRole="header"
                  >
                    {copy.headline}
                  </AppText>
                  <AppText variant="label" color={colors.surfaceTextMuted} style={styles.heroBody}>
                    {copy.intro}
                  </AppText>
                </View>
              </Panel>
            </FadeSwap>
            <SuggestionChips suggestions={chatSuggestions} onPick={onSend} disabled={pending} />
          </View>
        ) : (
          messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              animateIn={!history.has(message.id)}
              reduceMotion={reduceMotion}
              onRetry={onRetry}
              onSignIn={onSignIn}
              onOpenRoute={onOpenRoute}
            />
          ))
        )}
        {pending ? <TypingIndicator /> : null}
      </ScrollView>

      <ChatComposer onSend={onSend} onVoice={onVoice} busy={pending} style={styles.composer} />
    </View>
  );
}
