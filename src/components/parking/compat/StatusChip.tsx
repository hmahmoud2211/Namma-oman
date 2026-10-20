import type Ionicons from '@expo/vector-icons/Ionicons';
import type { StyleProp, ViewStyle } from 'react-native';

import { StatusChip as AppStatusChip, type StatusTone as AppStatusTone } from '@/components/ui/StatusChip';

/**
 * Parklane's chip tones (the parking store's DisplayTone): `teal` arrivals and the active pass,
 * `violet` scheduled visits, `slate` finished ones, `indigo` an open invitation, `amber` needs
 * attention, `red` a problem.
 */
export type StatusTone = 'teal' | 'violet' | 'slate' | 'indigo' | 'amber' | 'red';

const TONES: Record<StatusTone, AppStatusTone> = {
  teal: 'positive',
  violet: 'accent',
  slate: 'neutral',
  indigo: 'accent',
  amber: 'warning',
  red: 'danger',
};

export interface StatusChipProps {
  label: string;
  tone: StatusTone;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Accepted for Parklane's API; this app's chips carry no halo. */
  glow?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Parklane's status chip API, drawn as this app's chip. */
export function StatusChip({ label, tone, icon, style }: StatusChipProps) {
  return (
    <AppStatusChip
      label={label}
      tone={TONES[tone]}
      icon={icon ? { set: 'ionicons', name: icon } : undefined}
      style={style}
    />
  );
}
