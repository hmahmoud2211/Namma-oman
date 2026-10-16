import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Linking, Pressable, View, type LayoutChangeEvent } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppIcon, type Glyph } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { InnerScreen, useInnerScreen } from '@/components/layout/InnerScreen';
import { Panel } from '@/components/ui/Panel';
import { PanelHeading } from '@/components/ui/PanelHeading';
import { ProgressStepper, type ProgressStep } from '@/components/ui/ProgressStepper';
import { StatusChip } from '@/components/ui/StatusChip';
import { resident } from '@/constants/resident';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { formatDate, formatTime, formatTimeRange } from '@/utils/date';

import {
  CATEGORIES_SHOWN,
  SEPARATOR,
  createRequest,
  emergencyPhone,
  maintenanceContent,
  requestStatusDisplay,
  sampleRequests,
  serviceCategories,
  telLink,
  type MaintenanceRequest,
  type RequestForm as RequestFormValues,
} from './MaintenanceScreen.data';
import { useMaintenanceStyles } from './MaintenanceScreen.styles';
import { RequestForm } from './RequestForm';

/** Opens the phone's dialer; a device without one (e.g. a tablet) just ignores it. */
function dial(phone: string | null) {
  Linking.openURL(telLink(phone)).catch(() => undefined);
}

export function MaintenanceScreen() {
  const { locale } = useLocale();
  const copy = maintenanceContent[locale];
  return (
    <InnerScreen
      overline={copy.overline}
      title={copy.title}
      subtitle={copy.subtitle}
      keyboardAvoiding
    >
      <MaintenanceContent />
    </InnerScreen>
  );
}

function MaintenanceContent() {
  const styles = useMaintenanceStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const { scrollToColumnY } = useInnerScreen();
  const copy = maintenanceContent[locale];

  // Screen-local until there is a maintenance backend to file requests with.
  // TODO(api): submit and load requests from the service once it exists.
  const [requests, setRequests] = useState<readonly MaintenanceRequest[]>(() => sampleRequests());
  const [activeId, setActiveId] = useState(() => requests[0].id);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  /** `undefined` while the form is closed; a category id, or '', while open. */
  const [formCategory, setFormCategory] = useState<string | undefined>(undefined);

  const formY = useRef(0);
  const activeY = useRef(0);
  const scrollToForm = useRef(false);

  const request = requests.find((item) => item.id === activeId) ?? requests[0];
  const history = requests.filter((item) => item.id !== request.id);
  const shownCategories = showAllCategories
    ? serviceCategories
    : serviceCategories.slice(0, CATEGORIES_SHOWN);

  const steps = useMemo<readonly ProgressStep[]>(
    () =>
      request.stages.map((stage) => ({
        id: stage.status,
        label: requestStatusDisplay[stage.status].label[locale],
        details: stage.date
          ? [
              formatDate(stage.date, locale),
              ...(stage.time ? [formatTime(stage.time, locale)] : []),
            ]
          : undefined,
      })),
    [locale, request],
  );
  const currentStep = request.stages.findIndex((stage) => stage.status === request.status);

  // A category tile opens the form on that category; "New Request" on none.
  const openForm = (categoryId: string) => {
    if (formCategory === undefined) {
      // Scrolled to once it has laid out (see the form's onLayout).
      scrollToForm.current = true;
    } else {
      scrollToColumnY(formY.current);
    }
    setFormCategory(categoryId);
  };

  const submitRequest = (form: RequestFormValues) => {
    const created = createRequest(form, requests);
    setRequests((current) => [created, ...current]);
    setActiveId(created.id);
    setFormCategory(undefined);
    setShowHistory(false);
    AccessibilityInfo.announceForAccessibility(copy.submitted(created.id));
    // The form folds away; the new request takes the Active Request panel.
    requestAnimationFrame(() => scrollToColumnY(activeY.current));
  };

  const showRequest = (id: string) => {
    setActiveId(id);
    setShowHistory(false);
    scrollToColumnY(activeY.current);
  };

  const openHistory = () => {
    setShowHistory(true);
    scrollToColumnY(activeY.current);
  };

  const onFormLayout = (event: LayoutChangeEvent) => {
    formY.current = event.nativeEvent.layout.y;
    if (scrollToForm.current) {
      scrollToForm.current = false;
      scrollToColumnY(formY.current);
    }
  };

  return (
    <>
      <Panel>
        <PanelHeading
          title={copy.categoriesTitle}
          icon={{ set: 'ionicons', name: 'grid-outline' }}
          actionLabel={showAllCategories ? copy.showLess : copy.viewAll}
          actionExpanded={showAllCategories}
          onActionPress={() => setShowAllCategories((current) => !current)}
        />
        <View style={styles.grid}>
          {shownCategories.map((category) => {
            const title = category.title[locale];
            return (
              <Pressable
                key={category.id}
                onPress={() => openForm(category.id)}
                accessibilityRole="button"
                accessibilityLabel={`${title}, ${category.subtitle[locale]}`}
                style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
              >
                <LinearGradient colors={colors.surfaceIconTileGradient} style={styles.tileIcon}>
                  <AppIcon {...category.icon} size={scale(14)} color={colors.surfaceIcon} />
                </LinearGradient>
                <AppText
                  variant="panelLabel"
                  color={colors.surfaceText}
                  align="center"
                  numberOfLines={1}
                >
                  {title}
                </AppText>
                <AppText
                  variant="labelTiny"
                  color={colors.surfaceTextMuted}
                  align="center"
                  numberOfLines={1}
                >
                  {category.subtitle[locale]}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </Panel>

      {formCategory !== undefined ? (
        <View onLayout={onFormLayout}>
          <RequestForm
            categoryId={formCategory || undefined}
            onSubmit={submitRequest}
            onClose={() => setFormCategory(undefined)}
          />
        </View>
      ) : null}

      <View
        onLayout={(event) => {
          activeY.current = event.nativeEvent.layout.y;
        }}
      >
        <Panel>
          <PanelHeading
            title={copy.activeTitle}
            icon={{ set: 'ionicons', name: 'document-text-outline' }}
            actionLabel={
              history.length > 0 ? (showHistory ? copy.showLess : copy.viewAll) : undefined
            }
            actionExpanded={history.length > 0 ? showHistory : undefined}
            onActionPress={() => setShowHistory((current) => !current)}
          />
          <RequestRow
            item={request}
            hint={copy.showsOtherRequests}
            onPress={() => setShowHistory((value) => !value)}
          />
          <ProgressStepper steps={steps} currentIndex={currentStep} style={styles.stepper} />
          <View style={styles.divider} />
          <View style={styles.details}>
            <Detail
              label={copy.technician}
              value={request.technician?.[locale] ?? copy.contactPending}
              icon={{ set: 'ionicons', name: 'person-outline' }}
            />
            <View style={styles.detailRule} />
            <Detail
              label={copy.visitDate}
              value={formatDate(request.visitDate, locale)}
              caption={formatTimeRange(request.visitWindow.from, request.visitWindow.to, locale)}
              icon={{ set: 'ionicons', name: 'calendar-outline' }}
            />
            <View style={styles.detailRule} />
            {/* Dials the technician; a new request has no one to call yet. */}
            <Pressable
              onPress={() => dial(request.contactPhone)}
              disabled={!request.contactPhone}
              accessibilityRole="button"
              accessibilityHint={copy.callTechnician}
              accessibilityState={{ disabled: !request.contactPhone }}
              style={({ pressed }) => [styles.detailCell, pressed && styles.pressed]}
            >
              <Detail
                label={copy.contact}
                value={request.contactPhone ?? copy.contactPending}
                icon={{ set: 'ionicons', name: 'call-outline' }}
              />
            </Pressable>
          </View>

          {showHistory && history.length > 0 ? (
            <View style={styles.history}>
              <View style={styles.divider} />
              <AppText variant="label" color={colors.surfaceTextMuted} style={styles.historyTitle}>
                {copy.historyTitle}
              </AppText>
              {history.map((item) => (
                <RequestRow
                  key={item.id}
                  item={item}
                  hint={copy.showsRequest}
                  onPress={() => showRequest(item.id)}
                />
              ))}
            </View>
          ) : null}
        </Panel>
      </View>

      <View style={styles.actions}>
        <AppButton
          title={copy.newRequest}
          variant="emerald"
          size="medium"
          icon={
            <AppIcon set="ionicons" name="add" size={scale(12)} color={colors.buttonEmeraldText} />
          }
          iconPosition="trailing"
          onPress={() => openForm('')}
          style={styles.actionButton}
        />
        <AppButton
          title={copy.myRequests}
          variant="surface"
          size="medium"
          onPress={openHistory}
          style={styles.actionButton}
        />
      </View>

      {/* Not itself a button: "Call Now" is, and web cannot nest buttons. */}
      <Panel style={styles.emergency}>
        <LinearGradient
          colors={[colors.chipDangerFill, colors.transparent]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.emergencyWash}
          pointerEvents="none"
        />
        <AppIcon
          set="ionicons"
          name="warning-outline"
          size={scale(20)}
          color={colors.chipDangerText}
        />
        <View style={styles.emergencyText}>
          <AppText variant="panelHeading" color={colors.surfaceText}>
            {copy.emergencyTitle}
          </AppText>
          <AppText variant="label" color={colors.surfaceTextMuted}>
            {copy.emergencyBody}
          </AppText>
        </View>
        <Pressable
          onPress={() => dial(emergencyPhone)}
          hitSlop={scale(8)}
          accessibilityRole="button"
          accessibilityLabel={copy.callNow}
          accessibilityHint={copy.callHint}
          style={({ pressed }) => [styles.callNow, pressed && styles.pressed]}
        >
          <AppIcon
            set="ionicons"
            name="call-outline"
            size={scale(10)}
            color={colors.chipDangerText}
          />
          <AppText variant="label" color={colors.chipDangerText}>
            {copy.callNow}
          </AppText>
        </Pressable>
      </Panel>
    </>
  );
}

/** One request: category badge, title, reference and unit, status and chevron. */
function RequestRow({
  item,
  hint,
  onPress,
}: {
  item: MaintenanceRequest;
  hint: string;
  onPress: () => void;
}) {
  const styles = useMaintenanceStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const category = serviceCategories.find((entry) => entry.id === item.categoryId);
  const status = requestStatusDisplay[item.status];
  const title = item.title[locale];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${item.id}, ${resident.unit[locale]}, ${status.label[locale]}`}
      accessibilityHint={hint}
      style={({ pressed }) => [styles.request, pressed && styles.pressed]}
    >
      <LinearGradient colors={colors.surfaceIconTileGradient} style={styles.requestBadge}>
        {category ? (
          <AppIcon {...category.icon} size={scale(13)} color={colors.surfaceIcon} />
        ) : null}
      </LinearGradient>
      <View style={styles.requestText}>
        <AppText variant="panelLabel" color={colors.surfaceText} numberOfLines={1}>
          {title}
        </AppText>
        <AppText variant="labelSmall" color={colors.surfaceTextMuted} numberOfLines={1}>
          {`${item.id}${SEPARATOR}${resident.unit[locale]}`}
        </AppText>
      </View>
      <StatusChip label={status.label[locale]} tone={status.tone} />
      <ChevronIcon size={scale(8)} color={colors.surfaceText} strokeWidth={3} />
    </Pressable>
  );
}

/** A detail under the stepper: icon and label over the value. */
function Detail({
  label,
  value,
  caption,
  icon,
}: {
  label: string;
  value: string;
  caption?: string;
  icon: Glyph;
}) {
  const styles = useMaintenanceStyles();
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  return (
    <View
      style={styles.detailCell}
      accessible
      accessibilityLabel={[label, value, caption].filter(Boolean).join(', ')}
    >
      <View style={styles.detailLabel}>
        <AppIcon {...icon} size={scale(9)} color={colors.surfaceIcon} />
        <AppText variant="labelSmall" color={colors.surfaceTextMuted}>
          {label}
        </AppText>
      </View>
      <AppText variant="panelLabel" color={colors.surfaceText} numberOfLines={2}>
        {value}
      </AppText>
      {caption ? (
        <AppText variant="labelTiny" color={colors.surfaceTextMuted}>
          {caption}
        </AppText>
      ) : null}
    </View>
  );
}
