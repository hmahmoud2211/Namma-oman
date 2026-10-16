import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { InnerScreen } from '@/components/layout/InnerScreen';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { FilterChip } from '@/components/ui/FilterChip';
import { Panel } from '@/components/ui/Panel';
import { PanelHeading } from '@/components/ui/PanelHeading';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useCubeDevices } from '@/hooks/useCubeDevices';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { useUnderDevelopment } from '@/hooks/useUnderDevelopment';
import type { CubeDevice } from '@/services/cube/cube.types';
import type { Glyph } from '@/components/common/AppIcon';

import { AddDeviceSheet } from './AddDeviceSheet';
import { AutomationRow, DeviceCard, EnergyGauge, EnergyLine, SceneTile } from './SmartHomeCards';
import {
  ClimateControls,
  ControlCard,
  CurtainControls,
  LightingControls,
  MediaControls,
  toneColor,
} from './SmartHomeControls';
import {
  acCard,
  activeSceneId,
  addDeviceContent,
  automations,
  climate,
  cubeCategoryGlyphs,
  curtainsCard,
  energy,
  formatKwh,
  hubErrorText,
  lighting,
  lightingCard,
  mediaCard,
  previewCounts,
  rooms,
  sampleDevices,
  scenes,
  smartHomeContent,
  type AcMode,
  type BulbPreset,
  type CurtainAction,
  type Scene,
} from './SmartHomeScreen.data';
import {
  GAUGE_SIZE,
  HEADING_ICON,
  SCENES_PER_ROW,
  useSmartHomeStyles,
} from './SmartHomeScreen.styles';

/** The panels whose "View All" opens the full list in place. */
type ExpandablePanel = 'scenes' | 'energy' | 'devices' | 'automations';

/** One card in Smart Devices, from the hub or from the sample data. */
interface DeviceItem {
  id: string;
  name: string;
  location: string;
  icon: Glyph;
  online: boolean;
  enabled: boolean;
  onToggle?: (next: boolean) => void;
}

/** A device on the CUBE hub as a card: switchable only if it has power control. */
function hubDeviceItem(
  device: CubeDevice,
  setPower: (id: string, on: boolean) => void,
): DeviceItem {
  const switchable = device.capabilities.some((entry) => entry.capability === 'power');
  return {
    id: device.serial_number,
    name: device.name,
    location: [device.manufacturer, device.model].filter(Boolean).join(' · '),
    icon: cubeCategoryGlyphs[device.display_category] ?? cubeCategoryGlyphs.chip,
    online: device.online,
    enabled: switchable ? device.state?.power?.powerState === 'on' : device.online,
    onToggle: switchable ? (next) => void setPower(device.serial_number, next) : undefined,
  };
}

/** Splits scenes into rows of four. */
function sceneRows(items: readonly Scene[]): Scene[][] {
  return Array.from({ length: Math.ceil(items.length / SCENES_PER_ROW) }, (_, row) =>
    items.slice(row * SCENES_PER_ROW, (row + 1) * SCENES_PER_ROW),
  );
}

/** Seeds a per-item on/off map from sample data. */
function enabledMap(items: readonly { id: string; enabled: boolean }[]) {
  return Object.fromEntries(items.map((item) => [item.id, item.enabled]));
}

export function SmartHomeScreen() {
  const styles = useSmartHomeStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const copy = smartHomeContent[locale];
  const addCopy = addDeviceContent[locale];
  const hub = useCubeDevices();
  // Links whose screens aren't designed yet (device details, the colour picker, routines).
  const showUnderDevelopment = useUnderDevelopment();

  // Screen-local until there is a home-automation backend to send commands to.
  // TODO(api): send each change to the unit's controller once that service exists.
  const [roomId, setRoomId] = useState(rooms[0].id);
  const [lightsOn, setLightsOn] = useState(true);
  const [brightness, setBrightness] = useState<number>(lighting.brightness);
  const [presetId, setPresetId] = useState<BulbPreset>('warm');
  const [acOn, setAcOn] = useState(true);
  const [temperature, setTemperature] = useState<number>(climate.temperature);
  const [fanSpeed, setFanSpeed] = useState<number>(climate.fanSpeed);
  const [acMode, setAcMode] = useState<AcMode>(climate.modes[0]);
  const [curtainsOn, setCurtainsOn] = useState(true);
  const [curtainAction, setCurtainAction] = useState<CurtainAction | null>(null);
  const [mediaOn, setMediaOn] = useState(true);
  const [mediaId, setMediaId] = useState<string | null>(null);
  const [sceneId, setSceneId] = useState(activeSceneId);
  const [devicesOn, setDevicesOn] = useState(() => enabledMap(sampleDevices));
  const [automationsOn, setAutomationsOn] = useState(() => enabledMap(automations));
  const [addOpen, setAddOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<ExpandablePanel, boolean>>({
    scenes: false,
    energy: false,
    devices: false,
    automations: false,
  });

  // "View All" opens the panel's full list in place; "Show Less" folds it back.
  const viewAll = (panel: ExpandablePanel) => ({
    actionLabel: expanded[panel] ? copy.showLess : copy.viewAll,
    actionExpanded: expanded[panel],
    onActionPress: () => setExpanded((current) => ({ ...current, [panel]: !current[panel] })),
  });

  const visibleScenes = expanded.scenes ? scenes : scenes.slice(0, previewCounts.scenes);

  // The hub's devices once it answers; sample devices while it can't be reached.
  const deviceItems: DeviceItem[] =
    hub.status === 'connected'
      ? hub.devices.map((device) => hubDeviceItem(device, hub.setPower))
      : sampleDevices.map((device) => ({
          id: device.id,
          name: device.name[locale],
          location: device.location[locale],
          icon: device.icon,
          online: device.online,
          enabled: devicesOn[device.id] ?? device.enabled,
          onToggle: (next: boolean) =>
            setDevicesOn((current) => ({ ...current, [device.id]: next })),
        }));
  const visibleDevices = expanded.devices
    ? deviceItems
    : deviceItems.slice(0, previewCounts.devices);
  const deviceNote =
    hub.status === 'connecting'
      ? addCopy.hubConnecting
      : hub.status === 'unreachable'
        ? addCopy.hubUnreachable
        : deviceItems.length === 0
          ? addCopy.noDevices
          : hub.error
            ? hubErrorText(hub.error, locale)
            : null;
  const visibleAutomations = expanded.automations
    ? automations
    : automations.slice(0, previewCounts.automations);

  const closeAddDevice = useCallback(() => setAddOpen(false), []);
  const headingIcon = (name: string, color: string) => (
    <AppIcon set="ionicons" name={name} size={scale(HEADING_ICON)} color={color} />
  );

  return (
    <InnerScreen
      overline={copy.overline}
      title={copy.title}
      subtitle={copy.subtitle}
      overlay={
        addOpen ? (
          <BottomSheet title={addCopy.title} onClose={closeAddDevice}>
            <AddDeviceSheet refresh={hub.refresh} />
          </BottomSheet>
        ) : null
      }
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.rooms}
        contentContainerStyle={styles.roomsContent}
        accessibilityRole="tablist"
      >
        {rooms.map((room) => (
          <FilterChip
            key={room.id}
            label={room.label[locale]}
            icon={room.icon}
            selected={room.id === roomId}
            onPress={() => setRoomId(room.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.grid}>
        <View style={styles.cell}>
          <ControlCard info={lightingCard} on={lightsOn} onToggle={setLightsOn}>
            <LightingControls
              brightness={brightness}
              onBrightnessChange={setBrightness}
              presetId={presetId}
              onPresetChange={setPresetId}
              onCustomColourPress={showUnderDevelopment}
            />
          </ControlCard>
        </View>
        <View style={styles.cell}>
          <ControlCard info={acCard} on={acOn} onToggle={setAcOn}>
            <ClimateControls
              temperature={temperature}
              onTemperatureChange={setTemperature}
              fanSpeed={fanSpeed}
              onFanSpeedChange={setFanSpeed}
              mode={acMode}
              onModeChange={setAcMode}
            />
          </ControlCard>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.cell}>
          <ControlCard info={curtainsCard} on={curtainsOn} onToggle={setCurtainsOn}>
            <CurtainControls action={curtainAction} onAction={setCurtainAction} />
          </ControlCard>
        </View>
        <View style={styles.cell}>
          <ControlCard info={mediaCard} on={mediaOn} onToggle={setMediaOn}>
            <MediaControls sourceId={mediaId} onSource={setMediaId} />
          </ControlCard>
        </View>
      </View>

      <Panel>
        <PanelHeading
          title={copy.scenesTitle}
          subtitle={copy.scenesSubtitle}
          icon={headingIcon('star-outline', colors.iconWarm)}
          {...viewAll('scenes')}
        />
        <View style={styles.sceneGrid} accessibilityRole="radiogroup">
          {sceneRows(visibleScenes).map((row) => (
            <View key={row[0].id} style={styles.sceneRow}>
              {row.map((scene) => (
                <SceneTile
                  key={scene.id}
                  label={scene.label[locale]}
                  icon={scene.icon}
                  active={scene.id === sceneId}
                  onPress={() => setSceneId(scene.id)}
                />
              ))}
              {Array.from({ length: SCENES_PER_ROW - row.length }, (_, index) => (
                <View key={`spacer-${index}`} style={styles.sceneSpacer} />
              ))}
            </View>
          ))}
        </View>
      </Panel>

      <Panel>
        <PanelHeading
          title={copy.energyTitle}
          subtitle={copy.energySubtitle}
          icon={headingIcon('leaf-outline', colors.surfaceIcon)}
          {...viewAll('energy')}
        />
        <View style={styles.energyBody}>
          <EnergyGauge
            value={formatKwh(energy.todayKwh, locale)}
            caption={copy.today}
            fraction={energy.todayKwh / energy.dailyBudgetKwh}
            trend={`${Math.abs(energy.changePercent)}%`}
            trendDown={energy.changePercent < 0}
            trendWord={energy.changePercent < 0 ? copy.trendDown : copy.trendUp}
            trendCaption={copy.vsYesterday}
            size={GAUGE_SIZE}
          />
          <View style={styles.energyRows}>
            {energy.breakdown.map((row) => (
              <EnergyLine
                key={row.id}
                label={row.label[locale]}
                value={formatKwh(row.kwh, locale)}
                icon={row.icon}
                iconColor={toneColor(colors, row.tone)}
              />
            ))}
          </View>
        </View>
        {expanded.energy ? (
          <View style={styles.energyRooms}>
            <AppText variant="label" color={colors.surfaceTextMuted}>
              {copy.energyByRoom}
            </AppText>
            {energy.byRoom.map(({ roomId: id, kwh }) => {
              const room = rooms.find((entry) => entry.id === id);
              return room ? (
                <EnergyLine
                  key={room.id}
                  label={room.label[locale]}
                  value={formatKwh(kwh, locale)}
                  icon={room.icon}
                  iconColor={colors.surfaceIcon}
                />
              ) : null;
            })}
          </View>
        ) : null}
      </Panel>

      <Panel>
        <PanelHeading
          title={copy.devicesTitle}
          subtitle={copy.devicesSubtitle}
          icon={headingIcon('git-network-outline', colors.iconWarm)}
          {...viewAll('devices')}
          trailing={
            <Pressable
              onPress={() => setAddOpen(true)}
              hitSlop={scale(10)}
              accessibilityRole="button"
              accessibilityLabel={addCopy.buttonLabel}
              style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
            >
              <AppIcon
                set="ionicons"
                name="add"
                size={scale(12)}
                color={colors.surfaceAccentText}
              />
            </Pressable>
          }
        />
        {deviceNote ? (
          <AppText
            variant="label"
            color={
              hub.error && hub.status === 'connected'
                ? colors.destructiveText
                : colors.surfaceTextMuted
            }
            style={styles.deviceNote}
            accessibilityLiveRegion="polite"
          >
            {deviceNote}
          </AppText>
        ) : null}
        <View style={styles.deviceGrid}>
          {visibleDevices.map((device) => (
            <View key={device.id} style={styles.deviceCell}>
              <DeviceCard
                name={device.name}
                location={device.location}
                icon={device.icon}
                online={device.online}
                statusLabel={device.online ? copy.online : copy.offline}
                enabled={device.enabled}
                onToggle={device.onToggle}
                onPress={showUnderDevelopment}
              />
            </View>
          ))}
        </View>
      </Panel>

      <Panel>
        <PanelHeading
          title={copy.automationTitle}
          subtitle={copy.automationSubtitle}
          icon={headingIcon('settings-outline', colors.surfaceIcon)}
          {...viewAll('automations')}
        />
        <View style={styles.automationList}>
          {visibleAutomations.map((automation) => (
            <AutomationRow
              key={automation.id}
              title={automation.title[locale]}
              summary={automation.summary[locale]}
              icon={automation.icon}
              enabled={automationsOn[automation.id] ?? automation.enabled}
              onToggle={(next) =>
                setAutomationsOn((current) => ({ ...current, [automation.id]: next }))
              }
              onPress={showUnderDevelopment}
            />
          ))}
        </View>
      </Panel>
    </InnerScreen>
  );
}
