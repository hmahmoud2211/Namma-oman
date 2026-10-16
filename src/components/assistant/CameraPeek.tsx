import { CameraView, type CameraType } from 'expo-camera';
import { File } from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import {
  Animated,
  Easing,
  Platform,
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
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

export interface CameraPeekHandle {
  /** Base64 JPEG (no `data:` prefix) of the current frame, or '' if there is none yet. */
  capture: () => Promise<string>;
}

interface CameraPeekProps {
  /** The assistant is studying a frame: sweep the scan line. */
  scanning: boolean;
  ref?: Ref<CameraPeekHandle>;
  style?: StyleProp<ViewStyle>;
}

const NATIVE = Platform.OS !== 'web';
/** Design dp. */
const d = { width: 84, height: 112, radius: 12, border: 1.2, flip: 22 } as const;
/** Frames are sent over the socket, so cap the longer side near full HD. */
const MAX_PICTURE_EDGE = 1920;
/** The backend suggests 0.8; phone sensors are far larger than webcams, so less. */
const JPEG_QUALITY = 0.55;

/**
 * A small live preview, pinned to a corner while the camera is on. The assistant asks for a
 * frame when the resident says "what is this?"; the preview then flashes and a scan line
 * sweeps it while the picture is studied. Defaults to the rear camera; the corner button flips.
 */
export function CameraPeek({ scanning, ref, style }: CameraPeekProps) {
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const styles = useStyles();
  const copy = assistantStrings[locale];
  const camera = useRef<CameraView>(null);
  const [ready, setReady] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [pictureSize, setPictureSize] = useState<string | undefined>(undefined);

  const [appear] = useState(() => new Animated.Value(0));
  const [flash] = useState(() => new Animated.Value(0));
  const [sweep] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const spring = Animated.spring(appear, {
      toValue: 1,
      damping: 14,
      stiffness: 170,
      useNativeDriver: true,
    });
    spring.start();
    return () => spring.stop();
  }, [appear]);

  useEffect(() => {
    if (!scanning) {
      sweep.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 1300,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [scanning, sweep]);

  const onReady = useCallback(async () => {
    setReady(true);
    if (!NATIVE) {
      return;
    }
    try {
      const sizes = (await camera.current?.getAvailablePictureSizesAsync()) ?? [];
      const best = sizes
        .map((size) => ({ size, match: /^(\d+)x(\d+)$/.exec(size) }))
        .filter((entry): entry is { size: string; match: RegExpExecArray } => entry.match !== null)
        .map(({ size, match }) => ({ size, edge: Math.max(Number(match[1]), Number(match[2])) }))
        .filter((entry) => entry.edge <= MAX_PICTURE_EDGE)
        .sort((a, b) => b.edge - a.edge)[0];
      if (best) {
        setPictureSize(best.size);
      }
    } catch {
      // keep the default size
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      capture: async () => {
        if (!camera.current || !ready) {
          return '';
        }
        flash.setValue(1);
        Animated.timing(flash, { toValue: 0, duration: 420, useNativeDriver: true }).start();
        const photo = await camera.current.takePictureAsync({
          base64: true,
          quality: JPEG_QUALITY,
          shutterSound: false,
        });
        if (NATIVE && photo?.uri) {
          try {
            new File(photo.uri).delete();
          } catch {
            // cache files are purged by the system anyway
          }
        }
        return (photo?.base64 ?? '').replace(/^data:image\/[a-z]+;base64,/i, '');
      },
    }),
    [flash, ready],
  );

  return (
    <Animated.View
      style={[
        styles.frame,
        style,
        {
          opacity: appear,
          transform: [{ scale: appear.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
        },
      ]}
    >
      <View style={styles.clip}>
        <CameraView
          ref={camera}
          style={StyleSheet.absoluteFill}
          facing={facing}
          mode="picture"
          mute
          animateShutter={false}
          pictureSize={pictureSize}
          onCameraReady={onReady}
        />
        {!ready ? (
          <View style={styles.waiting}>
            <AppIcon
              set="ionicons"
              name="camera-outline"
              size={scale(16)}
              color={colors.textOnBackgroundMuted}
            />
            <AppText variant="labelSmall" color={colors.textOnBackgroundMuted}>
              {copy.cameraStarting}
            </AppText>
          </View>
        ) : null}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.scan,
            {
              opacity: scanning ? 1 : 0,
              transform: [
                {
                  translateY: sweep.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-scale(18), scale(d.height)],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={colors.scanLine}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View pointerEvents="none" style={[styles.flash, { opacity: flash }]} />
      </View>

      <Pressable
        onPress={() => setFacing((side) => (side === 'back' ? 'front' : 'back'))}
        hitSlop={scale(6)}
        accessibilityRole="button"
        accessibilityLabel={copy.switchCamera}
        style={({ pressed }) => [styles.flip, pressed && styles.pressed]}
      >
        <AppIcon
          set="ionicons"
          name="camera-reverse-outline"
          size={scale(11)}
          color={colors.white}
        />
      </Pressable>
    </Animated.View>
  );
}

const useStyles = makeStyles(({ colors, borderRadius }, { scale }) => ({
  frame: {
    width: scale(d.width),
    height: scale(d.height),
    borderRadius: scale(d.radius),
    borderWidth: scale(d.border),
    borderColor: colors.accent,
    backgroundColor: colors.cameraFill,
    boxShadow: [{ offsetX: 0, offsetY: 0, blurRadius: scale(8), color: colors.homeDiscGlow }],
  },
  clip: {
    flex: 1,
    borderRadius: scale(d.radius - d.border),
    overflow: 'hidden',
  },
  waiting: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: scale(4),
    backgroundColor: colors.cameraFill,
  },
  scan: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: scale(18),
  },
  flash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.white,
  },
  flip: {
    position: 'absolute',
    end: scale(4),
    bottom: scale(4),
    width: scale(d.flip),
    height: scale(d.flip),
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cameraFill,
  },
  pressed: {
    opacity: 0.7,
  },
}));
