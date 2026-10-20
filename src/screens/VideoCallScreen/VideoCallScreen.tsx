import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Linking, Platform, Pressable, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppIcon, type Glyph } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { TextField } from '@/components/common/FormField';
import { InnerScreen } from '@/components/layout/InnerScreen';
import { Panel } from '@/components/ui/Panel';
import { PanelHeading } from '@/components/ui/PanelHeading';
import { meetConfig } from '@/constants/meetConfig';
import { resident } from '@/constants/resident';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { useToast } from '@/hooks/useToast';
import { meetApi } from '@/services/meet/meetApi';
import {
  codeFromInvite,
  formatMeetCode,
  isCompleteMeetCode,
  normalizeMeetCode,
} from '@/services/meet/meetCode';
import type { CreatedRoom } from '@/services/meet/meet.types';
import { shareInvite } from '@/services/meet/shareInvite';
import { loadWebRTC } from '@/services/meet/webrtc';

import { meetErrorMessage, videoCallContent } from './VideoCallScreen.data';
import { useVideoCallStyles } from './VideoCallScreen.styles';

/** The lobby: start a call and share its code, or join one with a code (docs/API.md §1). */
export function VideoCallScreen() {
  const navigation = useNavigation();
  const styles = useVideoCallStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const { showToast } = useToast();
  const copy = videoCallContent[locale];
  // Expo Go has no native WebRTC, and browsers hide the camera off https: calls then open in
  // the meet server's own web client instead.
  const isWeb = Platform.OS === 'web';
  const [hasNativeCalls] = useState(() => loadWebRTC() !== null);

  // Follows the language until the resident types their own.
  const [nameDraft, setName] = useState<string | null>(null);
  const name = nameDraft ?? resident.name[locale];
  const [invite, setInvite] = useState<CreatedRoom | null>(null);
  const [creating, setCreating] = useState(false);
  const [startError, setStartError] = useState<string | undefined>();
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | undefined>();

  const displayName = name.trim() || resident.name[locale];

  const enterCall = useCallback(
    (callCode: string) => {
      if (!hasNativeCalls) {
        void Linking.openURL(`${meetConfig.baseUrl}/?call=${callCode}`).catch(() => undefined);
        return;
      }
      navigation.navigate('VideoCallRoom', { code: callCode, name: displayName });
    },
    [displayName, hasNativeCalls, navigation],
  );

  const handleStart = useCallback(async () => {
    setStartError(undefined);
    setCreating(true);
    try {
      setInvite(await meetApi.createRoom());
    } catch (error) {
      setStartError(meetErrorMessage(error, locale));
    } finally {
      setCreating(false);
    }
  }, [locale]);

  const handleCodeChange = useCallback((text: string) => {
    setJoinError(undefined);
    setCode(formatMeetCode(codeFromInvite(text)));
  }, []);

  const handleJoin = useCallback(async () => {
    const canonical = normalizeMeetCode(code);
    if (!isCompleteMeetCode(canonical)) {
      setJoinError(copy.codeIncomplete);
      return;
    }
    setJoinError(undefined);
    setJoining(true);
    try {
      // Checked first, so a typo never costs the resident a camera permission prompt.
      await meetApi.lookupRoom(canonical);
      enterCall(canonical);
    } catch (error) {
      setJoinError(meetErrorMessage(error, locale));
    } finally {
      setJoining(false);
    }
  }, [code, copy.codeIncomplete, enterCall, locale]);

  const inviteText = invite ? copy.inviteMessage(invite.formattedCode, invite.joinUrl) : '';

  const shareActions: { id: string; label: string; icon: Glyph; onPress: () => void }[] = [
    {
      id: 'share',
      label: copy.share,
      icon: { set: 'ionicons', name: 'share-social-outline' },
      onPress: () =>
        void shareInvite(inviteText, copy.inviteSubject).then((result) => {
          if (result === 'copied') showToast({ title: copy.inviteCopied });
        }),
    },
    {
      id: 'whatsapp',
      label: copy.whatsapp,
      icon: { set: 'ionicons', name: 'logo-whatsapp' },
      onPress: () =>
        void Linking.openURL(`https://wa.me/?text=${encodeURIComponent(inviteText)}`).catch(
          () => undefined,
        ),
    },
    {
      id: 'email',
      label: copy.email,
      icon: { set: 'ionicons', name: 'mail-outline' },
      onPress: () =>
        void Linking.openURL(
          `mailto:?subject=${encodeURIComponent(copy.inviteSubject)}&body=${encodeURIComponent(inviteText)}`,
        ).catch(() => undefined),
    },
  ];

  return (
    <InnerScreen
      overline={copy.overline}
      title={copy.title}
      subtitle={copy.subtitle}
      keyboardAvoiding
    >
      {!hasNativeCalls && (
        <Panel rim="plain" style={styles.notice}>
          <AppIcon
            set="ionicons"
            name="information-circle-outline"
            size={scale(14)}
            color={colors.surfaceIcon}
          />
          <AppText variant="label" color={colors.surfaceTextMuted} style={styles.noticeText}>
            {isWeb ? copy.browserUnsupported : copy.nativeUnavailable}
          </AppText>
        </Panel>
      )}

      {invite ? (
        <Panel>
          <PanelHeading
            title={copy.inviteTitle}
            subtitle={copy.inviteBody(invite.maxParticipants)}
            icon={{ set: 'ionicons', name: 'checkmark-circle-outline' }}
          />
          <View
            style={styles.codeBox}
            accessible
            accessibilityLabel={`${copy.codeLabel}: ${invite.formattedCode.split('').join(' ')}`}
          >
            <AppText variant="label" color={colors.surfaceTextMuted}>
              {copy.codeLabel}
            </AppText>
            <AppText variant="statMedium" color={colors.surfaceText} style={styles.code} selectable>
              {invite.formattedCode}
            </AppText>
          </View>
          <View style={styles.shareRow}>
            {shareActions.map((action) => (
              <Pressable
                key={action.id}
                onPress={action.onPress}
                accessibilityRole="button"
                accessibilityLabel={action.label}
                style={({ pressed }) => [styles.shareAction, pressed && styles.pressed]}
              >
                <AppIcon {...action.icon} size={scale(13)} color={colors.surfaceIcon} />
                <AppText variant="labelLarge" color={colors.surfaceText} numberOfLines={1}>
                  {action.label}
                </AppText>
              </Pressable>
            ))}
          </View>
          <View style={styles.buttonRow}>
            <AppButton
              title={copy.newCode}
              variant="surface"
              size="medium"
              onPress={() => void handleStart()}
              loading={creating}
              style={styles.flexButton}
            />
            <AppButton
              title={hasNativeCalls ? copy.enterCall : copy.openInBrowser}
              variant="emerald"
              size="medium"
              onPress={() => enterCall(invite.code)}
              style={styles.flexButton}
            />
          </View>
        </Panel>
      ) : (
        <Panel>
          <PanelHeading
            title={copy.startTitle}
            subtitle={copy.startBody}
            icon={{ set: 'ionicons', name: 'videocam-outline' }}
          />
          {startError ? (
            <AppText
              variant="label"
              color={colors.destructiveText}
              style={styles.error}
              accessibilityLiveRegion="polite"
            >
              {startError}
            </AppText>
          ) : null}
          <AppButton
            title={copy.startCta}
            variant="emerald"
            size="medium"
            onPress={() => void handleStart()}
            loading={creating}
            style={styles.primaryButton}
          />
        </Panel>
      )}

      <Panel>
        <PanelHeading
          title={copy.joinTitle}
          subtitle={copy.joinBody}
          icon={{ set: 'ionicons', name: 'enter-outline' }}
        />
        <TextField
          label={copy.codeField}
          placeholder={copy.codePlaceholder}
          icon={{ set: 'ionicons', name: 'keypad-outline' }}
          value={code}
          onChangeText={handleCodeChange}
          error={joinError}
          autoCapitalize="characters"
          autoCorrect={false}
          autoComplete="off"
          returnKeyType="go"
          onSubmitEditing={() => void handleJoin()}
          style={styles.field}
        />
        <AppButton
          title={copy.joinCta}
          variant="emerald"
          size="medium"
          onPress={() => void handleJoin()}
          loading={joining}
          style={styles.primaryButton}
        />
      </Panel>

      <Panel>
        <TextField
          label={copy.nameField}
          placeholder={copy.namePlaceholder}
          icon={{ set: 'ionicons', name: 'person-outline' }}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoComplete="name"
          maxLength={40}
        />
      </Panel>
    </InnerScreen>
  );
}
