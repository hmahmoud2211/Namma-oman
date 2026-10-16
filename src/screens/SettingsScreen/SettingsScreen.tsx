import { View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { InnerScreen, useInnerScreen } from '@/components/layout/InnerScreen';
import { ListRow } from '@/components/ui/ListRow';
import { Panel } from '@/components/ui/Panel';
import { PanelHeading } from '@/components/ui/PanelHeading';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useLogout } from '@/hooks/useLogout';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useUnderDevelopment } from '@/hooks/useUnderDevelopment';
import { makeStyles } from '@/utils/makeStyles';

import {
  appearanceOptions,
  languageOptions,
  settingsContent,
  settingsItems,
  type SettingsItem,
} from './SettingsScreen.data';

export function SettingsScreen() {
  const { locale } = useLocale();
  const copy = settingsContent[locale];
  return (
    <InnerScreen overline={copy.overline} title={copy.title} subtitle={copy.subtitle}>
      <SettingsContent />
    </InnerScreen>
  );
}

function SettingsContent() {
  const { colors } = useAppTheme();
  const { locale, setLocale } = useLocale();
  const { scale } = useResponsive();
  const { preference, setPreference } = useThemePreference();
  const { pickOption } = useInnerScreen();
  const logout = useLogout();
  const showUnderDevelopment = useUnderDevelopment();
  const styles = useStyles();
  const copy = settingsContent[locale];

  const currentValue = (item: SettingsItem) => {
    if (item.action === 'language') {
      return languageOptions.find((option) => option.id === locale)?.label;
    }
    if (item.action === 'appearance') {
      return appearanceOptions[locale].find((option) => option.id === preference)?.label;
    }
    return undefined;
  };

  const open = (item: SettingsItem) => {
    switch (item.action) {
      case 'language':
        pickOption({
          title: item.title[locale],
          options: languageOptions,
          selectedId: locale,
          onSelect: (option) => setLocale(option.id as 'en' | 'ar'),
        });
        return;
      case 'appearance':
        pickOption({
          title: item.title[locale],
          options: appearanceOptions[locale],
          selectedId: preference,
          onSelect: (option) => setPreference(option.id as typeof preference),
        });
        return;
      case 'logout':
        logout();
        return;
      default:
        showUnderDevelopment();
    }
  };

  return (
    <Panel>
      <PanelHeading
        title={copy.accountTitle}
        icon={{ set: 'ionicons', name: 'settings-outline' }}
      />
      <View>
        {settingsItems.map((item, index) => {
          const value = currentValue(item);
          const isLogout = item.action === 'logout';
          return (
            <ListRow
              key={item.id}
              divided={index > 0}
              icon={item.icon}
              iconColor={isLogout ? colors.destructiveText : undefined}
              title={item.title[locale]}
              details={[item.description[locale]]}
              onPress={() => open(item)}
              trailing={
                <View style={styles.trailing}>
                  {value ? (
                    <AppText variant="labelSmall" color={colors.surfaceAccentText}>
                      {value}
                    </AppText>
                  ) : null}
                  {isLogout ? null : (
                    <ChevronIcon size={scale(9)} color={colors.surfaceText} strokeWidth={3} />
                  )}
                </View>
              }
            />
          );
        })}
      </View>
    </Panel>
  );
}

const useStyles = makeStyles((_theme, { scale }) => ({
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(5),
  },
}));
