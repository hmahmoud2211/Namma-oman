import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StyleProp, ViewStyle } from 'react-native';

import { MapPinIcon } from '@/components/icons/MapPinIcon';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { resident } from '@/constants/resident';
import type { Localized } from '@/context/LocaleContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import type { RootStackParamList } from '@/types/navigation.types';

/** Design dp. */
const PIN_SIZE = 11.3;

const hint: Localized<string> = {
  en: 'Opens construction progress',
  ar: 'يفتح تقدّم البناء',
};

/** The signed-in resident's property card, opening the page shells; leads to Construction Progress. */
export function ResidentPropertyCard({ style }: { style?: StyleProp<ViewStyle> }) {
  const { locale } = useLocale();
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const property = resident.property[locale];
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SummaryCard
      photo={resident.propertyPhoto}
      title={property.projectName}
      subtitle={property.unitName}
      badge={property.role}
      meta={property.location}
      metaIcon={<MapPinIcon size={scale(PIN_SIZE)} color={colors.progressText} />}
      onPress={() => navigation.navigate('ConstructionProgress')}
      accessibilityHint={hint[locale]}
      style={style}
    />
  );
}
