import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type LinkingOptions,
  type Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo, type ReactNode } from 'react';
import { Platform } from 'react-native';

import { ThemeContext } from '@/context/ThemeContext';

import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { AmenitiesBookingScreen } from '@/screens/AmenitiesBookingScreen';
import { AssistantScreen } from '@/screens/AssistantScreen';
import { ChargingSessionScreen } from '@/screens/ChargingSessionScreen';
import { CommunityScreen } from '@/screens/CommunityScreen';
import { ConstructionProgressScreen } from '@/screens/ConstructionProgressScreen';
import { DemoControlsScreen } from '@/screens/DemoControlsScreen';
import { GuestPassScreen } from '@/screens/GuestPassScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { MaintenanceScreen } from '@/screens/MaintenanceScreen';
import { ParkingMapScreen } from '@/screens/ParkingMapScreen';
import { ParkingScreen } from '@/screens/ParkingScreen';
import { ReservationDetailsScreen } from '@/screens/ReservationDetailsScreen';
import { ReservationHistoryScreen } from '@/screens/ReservationHistoryScreen';
import { ReserveParkingScreen } from '@/screens/ReserveParkingScreen';
import { SecurityConsoleScreen } from '@/screens/SecurityConsoleScreen';
import { ServicesScreen } from '@/screens/ServicesScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { SignInScreen } from '@/screens/SignInScreen';
import { SmartHomeScreen } from '@/screens/SmartHomeScreen';
import { VideoCallRoomScreen } from '@/screens/VideoCallRoomScreen';
import { VideoCallScreen } from '@/screens/VideoCallScreen';
import { VisitorAccessScreen } from '@/screens/VisitorAccessScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { darkTheme } from '@/theme';
import type { RootStackParamList } from '@/types/navigation.types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const DOCUMENT_TITLE = 'Nama';

const ROUTE_NAMES: readonly (keyof RootStackParamList)[] = [
  'Welcome',
  'SignIn',
  'Home',
  'ConstructionProgress',
  'SmartHome',
  'VisitorAccess',
  'Parking',
  'Maintenance',
  'Community',
  'AmenitiesBooking',
  'Services',
  'Settings',
  'Assistant',
  'VideoCall',
  'ReservationHistory',
  'SecurityConsole',
  'DemoControls',
];

/**
 * Web only: the visitor's invitation gets its own address, /pass/<token>, so the link shared on
 * WhatsApp opens the pass without signing in, and the parking pages get addresses that survive
 * a refresh (their demo data does too, see services/parking). `/` is left unmapped so the app
 * still opens on its first screen (or EXPO_PUBLIC_INITIAL_ROUTE). Native deep links would need
 * an app scheme.
 */
const linking: LinkingOptions<RootStackParamList> = {
  enabled: Platform.OS === 'web',
  prefixes: [],
  config: {
    screens: {
      Parking: 'parking',
      ReserveParking: 'parking/reserve',
      ReservationDetails: {
        path: 'parking/reservation/:reservationId',
        parse: {
          justBooked: (value: string) => value === 'true',
          justEdited: (value: string) => value === 'true',
        },
      },
      ReservationHistory: 'parking/history',
      ParkingMap: 'parking/map',
      ChargingSession: 'parking/charging/:reservationId',
      SecurityConsole: 'parking/security',
      DemoControls: 'parking/demo',
      GuestPass: 'pass/:invite',
    },
  },
};

/**
 * Welcome and Sign In sit on dark artwork in both modes (mode 2 changes only the screens after
 * sign-in), so they always render with the dark theme.
 */
function DarkThemeLayout({ children }: { children: ReactNode }) {
  return <ThemeContext value={darkTheme}>{children}</ThemeContext>;
}

/**
 * Development only: `EXPO_PUBLIC_INITIAL_ROUTE=Home npx expo start` opens straight on a
 * screen that has no entry point yet (Home waits for sign-in, which needs the auth service).
 */
function getInitialRoute(): keyof RootStackParamList {
  const requested = __DEV__ ? process.env.EXPO_PUBLIC_INITIAL_ROUTE : undefined;
  return ROUTE_NAMES.find((name) => name === requested) ?? 'Welcome';
}

export function AppNavigator() {
  const { isDark, colors } = useAppTheme();
  const { isRTL } = useLocale();

  const navigationTheme = useMemo<Theme>(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return { ...base, colors: { ...base.colors, background: colors.background } };
  }, [isDark, colors.background]);

  return (
    <NavigationContainer
      theme={navigationTheme}
      linking={linking}
      direction={isRTL ? 'rtl' : 'ltr'}
      // Web: the browser tab shows the app name, not internal route names like "SignIn".
      documentTitle={{ formatter: () => DOCUMENT_TITLE }}
    >
      <Stack.Navigator
        initialRouteName={getInitialRoute()}
        // Screens push in from the side the reader moves towards.
        screenOptions={{ headerShown: false, animation: isRTL ? 'slide_from_left' : 'default' }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} layout={DarkThemeLayout} />
        <Stack.Screen name="SignIn" component={SignInScreen} layout={DarkThemeLayout} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ConstructionProgress" component={ConstructionProgressScreen} />
        {/* Resident services, migrated from the Parklane app. */}
        <Stack.Screen name="SmartHome" component={SmartHomeScreen} />
        <Stack.Screen name="VisitorAccess" component={VisitorAccessScreen} />
        <Stack.Screen name="Parking" component={ParkingScreen} />
        <Stack.Screen name="Maintenance" component={MaintenanceScreen} />
        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="AmenitiesBooking" component={AmenitiesBookingScreen} />
        {/* The main tab bar's other destinations. */}
        <Stack.Screen name="Assistant" component={AssistantScreen} />
        <Stack.Screen name="Services" component={ServicesScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="VideoCall" component={VideoCallScreen} />
        {/* A call holds the camera: no swipe-back, so it ends only on purpose. */}
        <Stack.Screen
          name="VideoCallRoom"
          component={VideoCallRoomScreen}
          options={{ gestureEnabled: false }}
        />
        {/* Visitor parking and EV charging (Parking's flows). */}
        <Stack.Screen name="ReserveParking" component={ReserveParkingScreen} />
        <Stack.Screen name="ReservationDetails" component={ReservationDetailsScreen} />
        <Stack.Screen name="ReservationHistory" component={ReservationHistoryScreen} />
        <Stack.Screen name="ParkingMap" component={ParkingMapScreen} />
        <Stack.Screen name="ChargingSession" component={ChargingSessionScreen} />
        <Stack.Screen name="GuestPass" component={GuestPassScreen} />
        <Stack.Screen name="SecurityConsole" component={SecurityConsoleScreen} />
        <Stack.Screen name="DemoControls" component={DemoControlsScreen} />
        {/* Register further screens here as their designs are implemented. */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
