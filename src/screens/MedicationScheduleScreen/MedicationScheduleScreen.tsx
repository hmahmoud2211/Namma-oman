import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { InnerScreen, useInnerScreen } from '@/components/layout/InnerScreen';
import { Panel } from '@/components/ui/Panel';
import { IMAGE_TRANSITION_MS } from '@/constants/images';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { useUnderDevelopment } from '@/hooks/useUnderDevelopment';
import { formatTime } from '@/utils/date';

import {
  dailyDoses,
  initialTaken,
  scheduleContent,
  scheduleDays,
  type MedicationDose,
  type ScheduleDay,
} from './MedicationScheduleScreen.data';
import { scheduleDesign as d, useScheduleStyles } from './MedicationScheduleScreen.styles';

export function MedicationScheduleScreen() {
  return (
    // The panel's heading is the page's title, as in the design.
    <InnerScreen showPropertyCard={false}>
      <ScheduleContent />
    </InnerScreen>
  );
}

function ScheduleContent() {
  const styles = useScheduleStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const { pickOption } = useInnerScreen();
  const showUnderDevelopment = useUnderDevelopment();
  const copy = scheduleContent[locale];

  // Screen-local until doses are tracked by a service (and remembered between visits).
  const [day, setDay] = useState<ScheduleDay>('today');
  const [taken, setTaken] = useState(initialTaken);
  const dayLabel = scheduleDays.find((option) => option.id === day)?.label[locale] ?? '';

  const toggleTaken = (dose: MedicationDose) =>
    setTaken((current) => {
      const ids = current[day];
      return {
        ...current,
        [day]: ids.includes(dose.id) ? ids.filter((id) => id !== dose.id) : [...ids, dose.id],
      };
    });

  const chooseDay = () =>
    pickOption({
      title: copy.chooseDay,
      options: scheduleDays.map((option) => ({ id: option.id, label: option.label[locale] })),
      selectedId: day,
      onSelect: (option) => setDay(option.id as ScheduleDay),
    });

  const openDoseOptions = (dose: MedicationDose, isTaken: boolean) =>
    pickOption({
      title: copy.doseOptions,
      kind: 'menu',
      options: [
        {
          id: 'toggle',
          label: isTaken ? copy.markNotTaken : copy.markAsTaken,
          icon: {
            set: 'ionicons',
            name: isTaken ? 'arrow-undo-outline' : 'checkmark-circle-outline',
          },
        },
        {
          id: 'details',
          label: copy.details,
          icon: { set: 'ionicons', name: 'information-circle-outline' },
        },
      ],
      onSelect: (option) => (option.id === 'toggle' ? toggleTaken(dose) : showUnderDevelopment()),
    });

  return (
    <Panel flush style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="value" color={colors.surfaceText} accessibilityRole="header">
            {copy.title}
          </AppText>
          <AppText variant="label" color={colors.surfaceText} style={styles.subtitle}>
            {copy.subtitle}
          </AppText>
        </View>
        <Pressable
          onPress={chooseDay}
          hitSlop={scale(d.day.hitSlop)}
          accessibilityRole="button"
          accessibilityLabel={`${copy.chooseDay}: ${dayLabel}`}
          style={({ pressed }) => [styles.day, pressed && styles.pressed]}
        >
          <AppIcon
            set="ionicons"
            name="calendar-outline"
            size={scale(d.day.icon)}
            color={colors.surfaceText}
          />
          <AppText variant="value" color={colors.surfaceText} style={styles.dayLabel}>
            {dayLabel}
          </AppText>
          <AppIcon
            set="ionicons"
            name="chevron-down"
            size={scale(d.day.chevron)}
            color={colors.surfaceText}
          />
        </Pressable>
      </View>

      <View style={styles.rows}>
        {dailyDoses.map((dose) => {
          const isTaken = taken[day].includes(dose.id);
          return (
            <DoseRow
              key={dose.id}
              dose={dose}
              taken={isTaken}
              onToggle={() => toggleTaken(dose)}
              onOptions={() => openDoseOptions(dose, isTaken)}
            />
          );
        })}
      </View>
    </Panel>
  );
}

interface DoseRowProps {
  dose: MedicationDose;
  taken: boolean;
  onToggle: () => void;
  onOptions: () => void;
}

/** One dose: time, pill, name and instructions, the taken toggle and its options. */
function DoseRow({ dose, taken, onToggle, onOptions }: DoseRowProps) {
  const styles = useScheduleStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const copy = scheduleContent[locale];
  const time = formatTime(dose.time, locale);
  const [clock, meridiem] = time.split(' ');
  const name = dose.name[locale];
  const strength = dose.strength[locale];

  return (
    <View style={styles.row}>
      <LinearGradient
        colors={colors.surfaceIconTileGradient}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.time} accessible accessibilityLabel={time}>
        <AppText variant="value" color={colors.surfaceText}>
          {clock}
        </AppText>
        <AppText variant="labelTiny" color={colors.surfaceTextMuted}>
          {meridiem}
        </AppText>
      </View>
      <View style={styles.divider} />
      <Image
        source={dose.image}
        contentFit="contain"
        transition={IMAGE_TRANSITION_MS}
        style={styles.pill}
      />
      <View
        style={styles.doseText}
        accessible
        accessibilityLabel={`${name} ${strength}, ${dose.instructions[locale]}`}
      >
        <AppText variant="badge" color={colors.surfaceText} numberOfLines={1}>
          {name}{' '}
          <AppText variant="label" color={colors.surfaceText}>
            {strength}
          </AppText>
        </AppText>
        <AppText variant="labelSmall" color={colors.surfaceTextMuted} numberOfLines={1}>
          {dose.instructions[locale]}
        </AppText>
      </View>
      <Pressable
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: taken }}
        accessibilityLabel={`${copy.markAsTaken}: ${name}`}
        style={({ pressed }) => [
          styles.toggle,
          taken && styles.toggleTaken,
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.toggleCircle, taken && styles.toggleCircleTaken]}>
          {taken ? (
            <CheckIcon size={scale(d.row.toggle.tick)} color={colors.medicationTakenText} />
          ) : null}
        </View>
        <AppText
          variant={taken ? 'badge' : 'labelSmall'}
          color={taken ? colors.medicationTakenText : colors.surfaceTextMuted}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {taken ? copy.taken : copy.markAsTaken}
        </AppText>
      </Pressable>
      <Pressable
        onPress={onOptions}
        accessibilityRole="button"
        accessibilityLabel={`${copy.doseOptions}: ${name}`}
        style={({ pressed }) => [styles.menu, pressed && styles.pressed]}
      >
        <AppIcon
          set="ionicons"
          name="ellipsis-vertical"
          size={scale(d.row.menu.icon)}
          color={colors.surfaceText}
        />
      </Pressable>
    </View>
  );
}
