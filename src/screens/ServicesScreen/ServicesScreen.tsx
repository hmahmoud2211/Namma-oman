import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { InnerScreen } from '@/components/layout/InnerScreen';
import { ListRow } from '@/components/ui/ListRow';
import { Panel } from '@/components/ui/Panel';
import { PanelHeading } from '@/components/ui/PanelHeading';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { useUnderDevelopment } from '@/hooks/useUnderDevelopment';

import {
  everydayServices,
  servicesContent,
  type ServiceLink,
} from './ServicesScreen.data';

export function ServicesScreen() {
  const navigation = useNavigation();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const copy = servicesContent[locale];
  const showUnderDevelopment = useUnderDevelopment();

  const open = (service: ServiceLink) =>
    service.route ? navigation.navigate(service.route) : showUnderDevelopment();

  const section = (title: string, icon: string, items: readonly ServiceLink[]) => (
    <Panel>
      <PanelHeading title={title} icon={{ set: 'ionicons', name: icon }} />
      <View>
        {items.map((service, index) => (
          <ListRow
            key={service.id}
            divided={index > 0}
            icon={service.icon}
            title={service.title[locale]}
            details={[service.description[locale]]}
            onPress={() => open(service)}
            trailing={<ChevronIcon size={scale(9)} color={colors.surfaceText} strokeWidth={3} />}
          />
        ))}
      </View>
    </Panel>
  );

  return (
    <InnerScreen
      overline={copy.overline}
      title={copy.title}
      subtitle={copy.subtitle}
      showPropertyCard={false}
    >
      {section(copy.everydayTitle, 'sparkles-outline', everydayServices)}
    </InnerScreen>
  );
}
