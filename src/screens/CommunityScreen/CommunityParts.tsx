import { useState } from 'react';
import { Keyboard, Pressable, View } from 'react-native';

import { AppIcon, type Glyph } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { SelectField, TextField } from '@/components/common/FormField';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { useInnerScreen } from '@/components/layout/InnerScreen';
import { FormPanel } from '@/components/ui/FormPanel';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

import {
  communityContent,
  feedbackTopicLabel,
  feedbackTopicOptions,
  validateFeedback,
  type FeedbackErrors,
  type FeedbackForm as FeedbackValues,
} from './CommunityScreen.data';

/** Design dp. */
const d = { radio: 11, check: 7, icon: 11, gap: 7, bar: 4, percent: 26, rowY: 6 } as const;

interface PollOptionRowProps {
  label: string;
  icon: Glyph;
  /** Share of the vote, 0-1. */
  share: number;
  selected: boolean;
  onSelect: () => void;
}

/** One answer in a poll: tapping it casts, or moves, the resident's vote. */
export function PollOptionRow({ label, icon, share, selected, onSelect }: PollOptionRowProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  const percent = `${Math.round(share * 100)}%`;

  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${label}, ${percent}`}
      style={({ pressed }) => [styles.pollRow, pressed && styles.pressed]}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <CheckIcon size={scale(d.check)} color={colors.timelineTick} /> : null}
      </View>
      <AppIcon {...icon} size={scale(d.icon)} color={colors.surfaceIcon} />
      <View style={styles.pollText}>
        <AppText variant="panelLabel" color={colors.surfaceText} numberOfLines={1}>
          {label}
        </AppText>
        <ProgressBar progress={share} height={d.bar} style={styles.pollBar} />
      </View>
      <AppText variant="panelLabel" color={colors.surfaceText} style={styles.percent}>
        {percent}
      </AppText>
    </Pressable>
  );
}

interface FeedbackFormProps {
  /** Receives a message that passed validation. */
  onSubmit: (feedback: FeedbackValues) => void;
  onClose: () => void;
}

/** "Share Feedback": a topic and a message for management. */
export function FeedbackForm({ onSubmit, onClose }: FeedbackFormProps) {
  const { locale } = useLocale();
  const { pickOption } = useInnerScreen();
  const copy = communityContent[locale];
  const [form, setForm] = useState<FeedbackValues>({ topic: '', message: '' });
  const [errors, setErrors] = useState<FeedbackErrors>({});

  const update = (key: keyof FeedbackValues, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const openTopics = () => {
    Keyboard.dismiss();
    pickOption({
      title: copy.feedbackTopicLabel,
      options: feedbackTopicOptions(locale),
      selectedId: form.topic,
      onSelect: (option) => update('topic', option.id),
    });
  };

  const submit = () => {
    Keyboard.dismiss();
    const found = validateFeedback(form, locale);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    onSubmit({ topic: form.topic, message: form.message.trim() });
  };

  return (
    <FormPanel
      icon={{ set: 'ionicons', name: 'chatbubbles-outline' }}
      title={copy.feedbackFormTitle}
      subtitle={copy.feedbackFormSubtitle}
      submitLabel={copy.feedbackSend}
      onSubmit={submit}
      onClose={onClose}
      closeLabel={copy.feedbackClose}
    >
      <SelectField
        label={copy.feedbackTopicLabel}
        placeholder={copy.feedbackTopicPlaceholder}
        value={feedbackTopicLabel(form.topic, locale)}
        icon={{ set: 'ionicons', name: 'pricetag-outline' }}
        error={errors.topic}
        onPress={openTopics}
      />
      <TextField
        label={copy.feedbackMessageLabel}
        placeholder={copy.feedbackMessagePlaceholder}
        value={form.message}
        onChangeText={(text) => update('message', text)}
        error={errors.message}
        multiline
        maxLength={500}
        autoCapitalize="sentences"
      />
    </FormPanel>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  pressed: {
    opacity: 0.7,
  },
  pollRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(d.gap),
    paddingVertical: scale(d.rowY),
  },
  radio: {
    width: scale(d.radio),
    height: scale(d.radio),
    borderRadius: borderRadius.pill,
    borderWidth: scale(0.9),
    borderColor: colors.timelinePending,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.surfaceIcon,
    backgroundColor: colors.surfaceIcon,
  },
  pollText: {
    flex: 1,
  },
  pollBar: {
    marginTop: scale(3),
  },
  percent: {
    width: scale(d.percent),
    textAlign: 'right',
  },
}));
