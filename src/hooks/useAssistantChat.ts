import { useCallback, useEffect, useRef, useState } from 'react';

import type { AnswerSummary } from '@/services/assistant/assistant.types';
import {
  AssistantApiError,
  sendChatMessage,
  type AssistantErrorKind,
} from '@/services/assistant/assistantApi';

/**
 * `answered` and `declined` are both replies from the assistant (`ok` true or false);
 * `failed` means it could not be reached, and offers a retry.
 */
export type ChatMessageStatus = 'sent' | 'answered' | 'declined' | 'failed';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  /** Empty on a failed reply, and on an answer with no text (the screen words both). */
  text: string;
  status: ChatMessageStatus;
  createdAt: number;
  summary?: AnswerSummary;
  /** On a failed reply: why, and the question to send again. */
  failure?: AssistantErrorKind | 'unknown';
  retryText?: string;
}

let sequence = 0;
const nextId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${(sequence++).toString(36)}`;

/** Memory needs a stable key; guests get one for as long as the app runs. */
const guestUserId = `guest-${Math.random().toString(36).slice(2, 10)}`;

/**
 * The text conversation (FRONTEND_INTEGRATION.md §4.2): one question at a time, with
 * `session_id` carried forward so follow-ups ("and yesterday?") keep their context.
 * Switching resident starts a new conversation.
 */
export function useAssistantChat(residentId: number | null) {
  const [messages, setMessages] = useState<readonly ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const sessionId = useRef<string | undefined>(undefined);
  const inFlight = useRef<AbortController | null>(null);

  const ask = useCallback(
    async (text: string) => {
      const controller = new AbortController();
      inFlight.current = controller;
      setPending(true);
      try {
        const reply = await sendChatMessage(
          {
            message: text,
            ...(residentId != null ? { resident_id: residentId } : { user_id: guestUserId }),
            ...(sessionId.current ? { session_id: sessionId.current } : null),
          },
          controller.signal,
        );
        if (controller.signal.aborted) {
          return;
        }
        sessionId.current = reply.session_id || sessionId.current;
        setMessages((list) => [
          ...list,
          {
            id: nextId('a'),
            role: 'assistant',
            text: reply.answer?.trim() ?? '',
            status: reply.ok ? 'answered' : 'declined',
            createdAt: Date.now(),
            summary: reply.summary,
          },
        ]);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        setMessages((list) => [
          ...list,
          {
            id: nextId('a'),
            role: 'assistant',
            text: '',
            status: 'failed',
            createdAt: Date.now(),
            failure: error instanceof AssistantApiError ? error.kind : 'unknown',
            retryText: text,
          },
        ]);
      } finally {
        if (inFlight.current === controller) {
          inFlight.current = null;
          setPending(false);
        }
      }
    },
    [residentId],
  );

  /** Wait for the reply before sending the next question, as the backend asks. */
  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || inFlight.current) {
        return false;
      }
      setMessages((list) => [
        ...list,
        { id: nextId('u'), role: 'user', text, status: 'sent', createdAt: Date.now() },
      ]);
      void ask(text);
      return true;
    },
    [ask],
  );

  /** Re-asks the question behind a failed reply, replacing the failure. */
  const retry = useCallback(
    (messageId: string) => {
      if (inFlight.current) {
        return;
      }
      const failed = messages.find((message) => message.id === messageId);
      if (!failed?.retryText) {
        return;
      }
      setMessages((list) => list.filter((message) => message.id !== messageId));
      void ask(failed.retryText);
    },
    [ask, messages],
  );

  const reset = useCallback(() => {
    inFlight.current?.abort();
    inFlight.current = null;
    sessionId.current = undefined;
    setPending(false);
    setMessages([]);
  }, []);

  // A conversation belongs to one resident.
  const residentRef = useRef(residentId);
  useEffect(() => {
    if (residentRef.current !== residentId) {
      residentRef.current = residentId;
      reset();
    }
  }, [residentId, reset]);

  useEffect(() => () => inFlight.current?.abort(), []);

  return { messages, pending, send, retry, reset };
}
