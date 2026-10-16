import { useNavigation } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { AccessibilityInfo, Keyboard, Pressable, View, type TextInputInstance } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText } from '@/components/common/AppText';
import { SelectField, TextField } from '@/components/common/FormField';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { ParkingIcon } from '@/components/icons/ParkingIcon';
import { InnerScreen, useInnerScreen } from '@/components/layout/InnerScreen';
import { initialsOf } from '@/components/ui/Avatar';
import { FormPanel, FormRow } from '@/components/ui/FormPanel';
import { Panel } from '@/components/ui/Panel';
import { PanelHeading } from '@/components/ui/PanelHeading';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { useToast } from '@/hooks/useToast';
import { downloadPdf } from '@/services/documents/exportPdf';
import { formatDay, formatTime } from '@/utils/date';

import { VisitorPassCard, VisitorRow } from './VisitorAccessCards';
import {
  SEPARATOR,
  UPCOMING_LIMIT,
  dateOptions,
  fieldCopy,
  formFields,
  guestOptions,
  guestsLabel,
  initialForm,
  passPayload,
  sampleVisitors,
  selectLabel,
  statusDisplay,
  timeOptions,
  validateForm,
  visitorContent,
  type FormErrors,
  type FormFieldConfig,
  type FormFieldKey,
  type SelectKey,
  type VisitorForm,
  type VisitorPass,
} from './VisitorAccessScreen.data';
import { buildPassDocument } from './VisitorAccessScreen.documents';
import { useVisitorStyles } from './VisitorAccessScreen.styles';

/** The fields in two-column rows. */
const fieldRows: readonly (readonly FormFieldConfig[])[] = Array.from(
  { length: Math.ceil(formFields.length / 2) },
  (_, row) => formFields.slice(row * 2, row * 2 + 2),
);

export function VisitorAccessScreen() {
  const { locale } = useLocale();
  const copy = visitorContent[locale];
  return (
    <InnerScreen
      overline={copy.overline}
      title={copy.title}
      subtitle={copy.subtitle}
      keyboardAvoiding
    >
      <VisitorAccessContent />
    </InnerScreen>
  );
}

function VisitorAccessContent() {
  const navigation = useNavigation();
  const styles = useVisitorStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const { showToast } = useToast();
  const { pickOption } = useInnerScreen();
  const copy = visitorContent[locale];
  const labels = fieldCopy[locale];

  // Frontend only: passes live in this screen's state until a backend issues real ones.
  const [visitors, setVisitors] = useState<readonly VisitorPass[]>(() => sampleVisitors());
  const [activeId, setActiveId] = useState<string | null>(() => visitors[0]?.id ?? null);
  const [form, setForm] = useState<VisitorForm>(() => initialForm());
  const [errors, setErrors] = useState<FormErrors>({});
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const mobileRef = useRef<TextInputInstance>(null);

  const activePass = visitors.find((visitor) => visitor.id === activeId) ?? null;
  const allUpcoming = visitors.filter((visitor) => visitor.id !== activeId);
  // "View All" only appears when someone is hidden behind it.
  const hasMoreUpcoming = allUpcoming.length > UPCOMING_LIMIT;
  const upcoming = showAllUpcoming ? allUpcoming : allUpcoming.slice(0, UPCOMING_LIMIT);

  const updateField = useCallback((key: FormFieldKey, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    // Editing a field clears its message; the rest wait for the next submit.
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  }, []);

  const openSelect = (key: SelectKey) => {
    Keyboard.dismiss();
    const options =
      key === 'date'
        ? dateOptions(locale)
        : key === 'time'
          ? timeOptions(locale)
          : guestOptions(locale);
    pickOption({
      title: labels[key].label,
      options,
      selectedId: form[key],
      onSelect: (option) => updateField(key, option.id),
    });
  };

  const handleGenerate = () => {
    Keyboard.dismiss();
    const found = validateForm(form, locale);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    const name = form.name.trim();
    const pass: VisitorPass = {
      id: `visitor-${Date.now()}`,
      name: { en: name, ar: name },
      mobile: form.mobile.trim(),
      date: form.date,
      time: form.time,
      guests: Number.parseInt(form.guests, 10) || 1,
      plate: form.plate.trim().toUpperCase(),
      status: 'scheduled',
    };
    setVisitors((current) => [pass, ...current]);
    setActiveId(pass.id);
    setForm(initialForm());
    setErrors({});
    AccessibilityInfo.announceForAccessibility(copy.passCreated(name));
  };

  // The visitor needs the QR, so the pass goes out as a one-page PDF: the share sheet on a
  // phone (WhatsApp, Mail, Files…), the print dialog's "Save as PDF" on the web.
  const sharePass = useCallback(
    (pass: VisitorPass) => {
      downloadPdf(buildPassDocument(pass, locale)).catch(() =>
        showToast({ title: copy.shareFailedTitle, body: copy.shareFailedBody }),
      );
    },
    [copy, locale, showToast],
  );

  const cancelPass = useCallback(
    (pass: VisitorPass) => {
      const remaining = visitors.filter((visitor) => visitor.id !== pass.id);
      setVisitors(remaining);
      // Brings the next visitor forward, so the card is never blank while anyone is expected.
      setActiveId(remaining[0]?.id ?? null);
      showToast({ title: copy.passCancelled });
    },
    [copy.passCancelled, showToast, visitors],
  );

  const openPassOptions = (pass: VisitorPass) =>
    pickOption({
      title: copy.passOptions,
      kind: 'menu',
      options: [
        { id: 'share', label: copy.sharePass, icon: { set: 'ionicons', name: 'share-outline' } },
        // Only a visit that hasn't happened yet can be cancelled.
        ...(pass.status === 'scheduled'
          ? [
              {
                id: 'cancel',
                label: copy.cancelPass,
                icon: { set: 'ionicons', name: 'close-circle-outline' } as const,
                destructive: true,
              },
            ]
          : []),
      ],
      onSelect: (option) => (option.id === 'share' ? sharePass(pass) : cancelPass(pass)),
    });

  const renderField = (field: FormFieldConfig) => {
    const { label, placeholder } = labels[field.key];
    if (field.kind === 'select') {
      const key = field.key as SelectKey;
      return (
        <SelectField
          key={key}
          label={label}
          placeholder={placeholder}
          value={selectLabel(key, form[key], locale)}
          icon={field.icon}
          error={errors[key]}
          onPress={() => openSelect(key)}
          style={styles.field}
        />
      );
    }
    const isPhone = field.kind === 'phone';
    return (
      <TextField
        key={field.key}
        ref={field.key === 'mobile' ? mobileRef : undefined}
        label={label}
        placeholder={placeholder}
        value={form[field.key]}
        onChangeText={(text) => updateField(field.key, text)}
        icon={field.icon}
        error={errors[field.key]}
        keyboardType={isPhone ? 'phone-pad' : 'default'}
        autoCapitalize={field.key === 'plate' ? 'characters' : 'words'}
        autoCorrect={false}
        autoComplete={field.key === 'name' ? 'name' : isPhone ? 'tel' : 'off'}
        textContentType={field.key === 'name' ? 'name' : isPhone ? 'telephoneNumber' : 'none'}
        returnKeyType={field.key === 'name' ? 'next' : 'done'}
        onSubmitEditing={field.key === 'name' ? () => mobileRef.current?.focus() : undefined}
        style={styles.field}
      />
    );
  };

  const schedule = (pass: VisitorPass) =>
    `${formatDay(pass.date, locale)}${SEPARATOR}${formatTime(pass.time, locale)}`;

  return (
    <>
      <FormPanel
        icon={{ set: 'ionicons', name: 'person-add-outline' }}
        title={copy.formTitle}
        subtitle={copy.formSubtitle}
        submitLabel={copy.generate}
        onSubmit={handleGenerate}
      >
        {fieldRows.map((row) => (
          <FormRow key={row[0].key}>{row.map(renderField)}</FormRow>
        ))}
      </FormPanel>

      {activePass ? (
        <VisitorPassCard
          qrValue={passPayload(activePass)}
          qrLabel={copy.passFor(activePass.name[locale])}
          name={activePass.name[locale]}
          schedule={schedule(activePass)}
          guestsLabel={guestsLabel(activePass.guests, locale)}
          plate={activePass.plate}
          caption={copy.passCaption}
          statusLabel={statusDisplay[activePass.status].label[locale]}
          statusIcon={statusDisplay[activePass.status].icon}
          moreLabel={copy.passOptions}
          onMorePress={() => openPassOptions(activePass)}
        />
      ) : null}

      <Panel>
        <PanelHeading
          title={copy.upcomingTitle}
          icon={{ set: 'ionicons', name: 'time-outline' }}
          actionLabel={
            hasMoreUpcoming ? (showAllUpcoming ? copy.showLess : copy.viewAll) : undefined
          }
          actionExpanded={hasMoreUpcoming ? showAllUpcoming : undefined}
          onActionPress={() => setShowAllUpcoming((current) => !current)}
        />
        <View style={styles.list}>
          {upcoming.length === 0 ? (
            <AppText variant="labelLarge" color={colors.surfaceTextMuted} style={styles.empty}>
              {copy.noVisitors}
            </AppText>
          ) : null}
          {upcoming.map((visitor, index) => {
            const name = visitor.name[locale];
            return (
              <VisitorRow
                key={visitor.id}
                divided={index > 0}
                name={name}
                meta={`${formatDay(visitor.date, locale)}, ${formatTime(visitor.time, locale)}${SEPARATOR}${guestsLabel(visitor.guests, locale)}`}
                initials={initialsOf(name)}
                plate={visitor.plate}
                statusLabel={statusDisplay[visitor.status].label[locale]}
                statusTone={statusDisplay[visitor.status].tone}
                hint={copy.showPass}
                onPress={() => setActiveId(visitor.id)}
              />
            );
          })}
        </View>
      </Panel>

      {/* Guest parking is booked from the Parking screen, with the free guest bays. */}
      <Pressable
        onPress={() => navigation.navigate('Parking')}
        accessibilityRole="button"
        accessibilityLabel={`${copy.parkingTitle}. ${copy.parkingSubtitle}`}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <Panel style={styles.parking}>
          <LinearGradient colors={colors.surfaceIconTileGradient} style={styles.parkingBadge}>
            <ParkingIcon size={scale(14)} color={colors.surfaceIcon} />
          </LinearGradient>
          <View style={styles.parkingText}>
            <AppText variant="panelHeading" color={colors.surfaceText}>
              {copy.parkingTitle}
            </AppText>
            <AppText variant="label" color={colors.surfaceTextMuted}>
              {copy.parkingSubtitle}
            </AppText>
          </View>
          {/* Wrapped: a bare SVG would paint under the card's glass on web. */}
          <View>
            <ChevronIcon size={scale(10.4)} color={colors.surfaceText} strokeWidth={3} />
          </View>
        </Panel>
      </Pressable>
    </>
  );
}
