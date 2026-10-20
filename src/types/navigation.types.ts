import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { Lang } from '@/services/parking/i18n';

/**
 * Every route in the root stack and its params.
 * Add a route here only together with its implemented screen.
 */
export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  Home: undefined;
  ConstructionProgress: undefined;
  SmartHome: undefined;
  VisitorAccess: undefined;
  Parking: undefined;
  Maintenance: undefined;
  Community: undefined;
  AmenitiesBooking: undefined;
  Services: undefined;
  Settings: undefined;
  /** Opens in chat unless `mode` asks for voice. */
  Assistant: { mode?: 'chat' | 'voice' } | undefined;
  /** Start a call or join one with a code. */
  VideoCall: undefined;
  /** In a call: `code` is canonical (no dashes); `name` is how others see the resident. */
  VideoCallRoom: { code: string; name: string };

  /* Visitor parking and EV charging, ported from Parklane's parking demo (docs/PARKING_DEMO.md there). */
  /** `reservationId` edits an upcoming booking. */
  ReserveParking: { mode: 'guest' | 'ev'; reservationId?: string };
  ReservationDetails: { reservationId: string; justBooked?: boolean; justEdited?: boolean };
  ReservationHistory: undefined;
  /** The page a visitor opens from their invitation link; no account needed. `lang` picks English or Arabic. */
  GuestPass: {
    invite: string;
    lang?: Lang;
    /** Demo only: the booking carried in the link (services/parking/passLink). */
    d?: string;
  };
  /** Gate-to-bay directions for a booking, a visitor's pass, or the resident's own bay. Arabic only from a pass. */
  ParkingMap: { reservationId?: string; invite?: string; spaceId?: string; lang?: Lang };
  ChargingSession: { reservationId: string };
  /** Demo only: the security desk's gate console. */
  SecurityConsole: undefined;
  /** Demo only: clock, simulated events and data reset. */
  DemoControls: undefined;
};

/** Routes that open without params, e.g. from data-driven tiles, tabs and assistant links. */
export type ParamlessRoute = {
  [K in keyof RootStackParamList]: undefined extends RootStackParamList[K] ? K : never;
}[keyof RootStackParamList];

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    // Types `useNavigation()` app-wide without passing generics.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
