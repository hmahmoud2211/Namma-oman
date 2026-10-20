import type { NativeStackScreenProps } from '@react-navigation/native-stack';

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
