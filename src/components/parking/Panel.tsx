import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme as useOmmanTheme } from '@/hooks/useAppTheme';

import { AppText } from './compat/AppText';
import { NeonPanel } from './compat/NeonPanel';
import { useAppTheme } from './compat/theme';

export interface PanelProps {
  title?: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Drawn at the end of the title row, e.g. a status chip or a link. */
  trailing?: ReactNode;
  children?: ReactNode;
  /** Body spacing; set false for edge-to-edge content such as a map. */
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * The parking flows' card: this app's glass panel with the gold rim, a heading with its gold
 * icon, and a padded body, so every section of a flow reads the same.
 */
export function Panel({ title, subtitle, icon, trailing, children, padded = true, style }: PanelProps) {
  const theme = useAppTheme();
  const { colors } = useOmmanTheme();

  return (
    <NeonPanel style={style}>
      {title ? (
        <View style={styles.heading}>
          {icon ? <Ionicons name={icon} size={18} color={colors.surfaceIcon} style={styles.icon} /> : null}
          <View style={styles.titles}>
            <AppText variant="sectionTitle" accessibilityRole="header">
              {title}
            </AppText>
            {subtitle ? (
              <AppText variant="label" color={theme.colors.textSupport} style={styles.subtitle}>
                {subtitle}
              </AppText>
            ) : null}
          </View>
          {trailing}
        </View>
      ) : null}
      {children ? (
        <View style={[padded && styles.body, !title && padded && styles.bodyTop]}>{children}</View>
      ) : null}
    </NeonPanel>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 4,
    gap: 10,
  },
  icon: {
    width: 22,
    textAlign: 'center',
  },
  titles: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  body: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 12,
  },
  bodyTop: {
    paddingTop: 14,
  },
});
