import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { MediaStreamTrack } from 'react-native-webrtc';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { Avatar, initialsOf } from '@/components/ui/Avatar';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';

import { CallVideo } from './CallVideo';

interface CallTileProps {
  label: string;
  /** For the initials shown while there's no picture. */
  name: string;
  track: MediaStreamTrack | null;
  /** A shared screen: shown whole rather than cropped to fill. */
  isScreen?: boolean;
  /** Your own front camera, mirrored as in a looking glass. */
  mirror?: boolean;
  cameraOn: boolean;
  micOn: boolean;
  speaking: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Design dp. */
const d = { radius: 12, avatar: 54, labelInset: 6, micIcon: 11, rim: 1.6 } as const;

/** One person's camera (or shared screen) in the call grid, with their name and mic state. */
export function CallTile({
  label,
  name,
  track,
  isScreen = false,
  mirror = false,
  cameraOn,
  micOn,
  speaking,
  style,
}: CallTileProps) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const styles = useStyles();
  const showVideo = track !== null && (cameraOn || isScreen);

  return (
    <View
      style={[styles.tile, speaking && styles.speaking, style]}
      accessible
      accessibilityLabel={label}
    >
      {showVideo && track ? (
        <CallVideo
          track={track}
          objectFit={isScreen ? 'contain' : 'cover'}
          mirror={mirror}
          style={styles.video}
        />
      ) : (
        <View style={styles.placeholder}>
          <Avatar initials={initialsOf(name) || '?'} size={d.avatar} />
        </View>
      )}

      <View style={styles.label}>
        {!micOn && !isScreen && (
          <AppIcon set="ionicons" name="mic-off" size={scale(d.micIcon)} color={colors.chipDangerText} />
        )}
        <AppText variant="labelLarge" color={colors.white} numberOfLines={1} style={styles.name}>
          {label}
        </AppText>
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors }, { scale }) => ({
  tile: {
    overflow: 'hidden',
    borderRadius: scale(d.radius),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceBorder,
    backgroundColor: colors.cameraFill,
  },
  speaking: {
    borderWidth: scale(d.rim),
    borderColor: colors.accent,
  },
  video: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    start: scale(d.labelInset),
    bottom: scale(d.labelInset),
    maxWidth: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(4),
    paddingHorizontal: scale(6),
    paddingVertical: scale(2.5),
    borderRadius: scale(8),
    // Over video in both themes, so the scrim's darkest stop rather than a themed surface.
    backgroundColor: colors.sceneScrim[2],
  },
  name: {
    flexShrink: 1,
  },
}));
