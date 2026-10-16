import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Linking, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppIcon, type Glyph } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { TextField } from '@/components/common/FormField';
import { cubeConfig } from '@/constants/cubeConfig';
import { useAppTheme } from '@/hooks/useAppTheme';
import { cubeFailureOf } from '@/hooks/useCubeDevices';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { addCamera, setZigbeePairing } from '@/services/cube/cubeApi';
import type { CubeDevice } from '@/services/cube/cube.types';
import { makeStyles } from '@/utils/makeStyles';

import { addDeviceContent, hubErrorText } from './SmartHomeScreen.data';

interface AddDeviceSheetProps {
  /** Re-reads the hub's devices; resolves to the list, or null if the hub is unreachable. */
  refresh: () => Promise<CubeDevice[] | null>;
}

type Notice = { tone: 'info' | 'success' | 'error'; text: string } | null;

/** Design dp. */
const d = { badge: 24, badgeIcon: 13, gap: 8, padding: 9, radius: 9, borderWidth: 0.6 } as const;

/**
 * Adds a device to the unit's eWeLink CUBE hub: pairs Zigbee devices (the hub adds whatever
 * joins; this counts what is new), registers an RTSP / ESP32 camera, or opens the hub console
 * for eWeLink Wi-Fi devices. Rendered inside a BottomSheet; closing it ends any search.
 */
export function AddDeviceSheet({ refresh }: AddDeviceSheetProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const styles = useStyles();
  const copy = addDeviceContent[locale];

  const [pairing, setPairing] = useState(false);
  const [pairingBusy, setPairingBusy] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [pairingNotice, setPairingNotice] = useState<Notice>(null);
  const knownSerials = useRef<Set<string>>(new Set());
  const pairingRef = useRef(false);

  const [cameraName, setCameraName] = useState('');
  const [cameraUrl, setCameraUrl] = useState('');
  const [cameraErrors, setCameraErrors] = useState<{ name?: string; url?: string }>({});
  const [cameraBusy, setCameraBusy] = useState(false);
  const [cameraNotice, setCameraNotice] = useState<Notice>(null);

  const errorNotice = useCallback(
    (caught: unknown): Notice => ({
      tone: 'error',
      text: hubErrorText(cubeFailureOf(caught), locale),
    }),
    [locale],
  );

  const stopPairing = useCallback(async () => {
    if (!pairingRef.current) {
      return;
    }
    pairingRef.current = false;
    setPairing(false);
    setSecondsLeft(0);
    // Best effort: the hub also stops on its own when the window runs out.
    await setZigbeePairing(false).catch(() => undefined);
  }, []);

  const startPairing = useCallback(async () => {
    setPairingBusy(true);
    setPairingNotice(null);
    try {
      const before = await refresh();
      knownSerials.current = new Set((before ?? []).map((device) => device.serial_number));
      await setZigbeePairing(true);
      pairingRef.current = true;
      setPairing(true);
      setSecondsLeft(cubeConfig.pairingSeconds);
      setPairingNotice({ tone: 'info', text: copy.zigbeeSearching });
    } catch (caught) {
      setPairingNotice(errorNotice(caught));
    } finally {
      setPairingBusy(false);
    }
  }, [copy.zigbeeSearching, errorNotice, refresh]);

  // While pairing: count down, and re-read the list to report devices as they join.
  useEffect(() => {
    if (!pairing) {
      return undefined;
    }
    const endsAt = Date.now() + cubeConfig.pairingSeconds * 1000;
    const tick = setInterval(() => {
      const left = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) {
        void stopPairing();
      }
    }, 1000);
    const poll = setInterval(async () => {
      const list = await refresh();
      const added = (list ?? []).filter(
        (device) => !knownSerials.current.has(device.serial_number),
      );
      if (added.length > 0 && pairingRef.current) {
        setPairingNotice({
          tone: 'success',
          text: addDeviceContent[locale].zigbeeFound(added.length),
        });
      }
    }, cubeConfig.pairingPollMs);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
    };
  }, [locale, pairing, refresh, stopPairing]);

  // Closing the sheet, or leaving the screen, ends the search.
  useEffect(() => () => void stopPairing(), [stopPairing]);

  const submitCamera = useCallback(async () => {
    const name = cameraName.trim();
    const streamUrl = cameraUrl.trim();
    const scheme = /^(rtsp|http):\/\//i.exec(streamUrl)?.[1]?.toLowerCase();
    const errors = {
      name: name ? undefined : copy.cameraNameMissing,
      url: scheme ? undefined : copy.cameraUrlInvalid,
    };
    setCameraErrors(errors);
    setCameraNotice(null);
    if (errors.name || errors.url) {
      return;
    }

    setCameraBusy(true);
    try {
      // The hub takes RTSP streams, and ESP32 cameras over plain HTTP.
      await addCamera({ name, streamUrl, protocol: scheme === 'rtsp' ? 'RTSP' : 'ESP32-CAM' });
      setCameraName('');
      setCameraUrl('');
      setCameraNotice({ tone: 'success', text: copy.cameraAdded });
      await refresh();
    } catch (caught) {
      setCameraNotice(errorNotice(caught));
    } finally {
      setCameraBusy(false);
    }
  }, [cameraName, cameraUrl, copy, errorNotice, refresh]);

  const notice = (value: Notice) =>
    value ? (
      <AppText
        variant="label"
        color={
          value.tone === 'error'
            ? colors.destructiveText
            : value.tone === 'success'
              ? colors.statusPositive
              : colors.surfaceTextMuted
        }
        style={styles.notice}
        accessibilityLiveRegion="polite"
      >
        {value.text}
      </AppText>
    ) : null;

  const countdown = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`;

  return (
    <View style={styles.sheet}>
      <AppText variant="labelLarge" color={colors.surfaceTextMuted}>
        {copy.subtitle}
      </AppText>

      <Option
        icon={{ set: 'ionicons', name: 'radio-outline' }}
        title={copy.zigbeeTitle}
        body={copy.zigbeeBody}
      >
        {pairing ? (
          <AppButton
            title={copy.zigbeeStop(countdown)}
            variant="surface"
            size="medium"
            onPress={() => void stopPairing()}
            style={styles.action}
          />
        ) : (
          <AppButton
            title={copy.zigbeeStart}
            variant="emerald"
            size="medium"
            loading={pairingBusy}
            onPress={() => void startPairing()}
            style={styles.action}
          />
        )}
        {notice(pairingNotice)}
      </Option>

      <Option
        icon={{ set: 'ionicons', name: 'videocam-outline' }}
        title={copy.cameraTitle}
        body={copy.cameraBody}
      >
        <TextField
          label={copy.cameraName}
          placeholder={copy.cameraNamePlaceholder}
          value={cameraName}
          onChangeText={setCameraName}
          error={cameraErrors.name}
          returnKeyType="next"
          style={styles.field}
        />
        <TextField
          label={copy.cameraUrl}
          placeholder={copy.cameraUrlPlaceholder}
          value={cameraUrl}
          onChangeText={setCameraUrl}
          error={cameraErrors.url}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="done"
          onSubmitEditing={() => void submitCamera()}
          style={styles.field}
        />
        <AppButton
          title={copy.cameraAdd}
          variant="emerald"
          size="medium"
          loading={cameraBusy}
          onPress={() => void submitCamera()}
          style={styles.action}
        />
        {notice(cameraNotice)}
      </Option>

      <Option
        icon={{ set: 'ionicons', name: 'wifi-outline' }}
        title={copy.wifiTitle}
        body={copy.wifiBody}
      >
        <AppButton
          title={copy.wifiOpen}
          variant="surface"
          size="medium"
          onPress={() => void Linking.openURL(cubeConfig.hubUrl).catch(() => undefined)}
          style={styles.action}
        />
      </Option>
    </View>
  );
}

/** One way to add a device: badge, title and explanation, then its controls. */
function Option({
  icon,
  title,
  body,
  children,
}: {
  icon: Glyph;
  title: string;
  body: string;
  children: ReactNode;
}) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  return (
    <View style={styles.option}>
      <View style={styles.optionHeading}>
        <LinearGradient colors={colors.surfaceIconTileGradient} style={styles.badge}>
          <AppIcon {...icon} size={scale(d.badgeIcon)} color={colors.surfaceIcon} />
        </LinearGradient>
        <View style={styles.optionText}>
          <AppText variant="panelHeading" color={colors.surfaceText} accessibilityRole="header">
            {title}
          </AppText>
          <AppText variant="label" color={colors.surfaceTextMuted}>
            {body}
          </AppText>
        </View>
      </View>
      {children}
    </View>
  );
}

const useStyles = makeStyles(({ colors }, { scale }) => ({
  sheet: {
    rowGap: scale(d.gap),
  },
  option: {
    padding: scale(d.padding),
    borderRadius: scale(d.radius),
    borderWidth: scale(d.borderWidth),
    borderColor: colors.surfaceBorder,
    backgroundColor: colors.fieldFill,
  },
  optionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  badge: {
    width: scale(d.badge),
    height: scale(d.badge),
    borderRadius: scale(6),
    borderWidth: scale(d.borderWidth),
    borderColor: colors.surfaceIconTileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
    marginStart: scale(d.gap),
  },
  field: {
    marginTop: scale(d.gap),
  },
  action: {
    marginTop: scale(d.gap),
  },
  notice: {
    marginTop: scale(6),
  },
}));
