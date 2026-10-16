import { DarkTheme, DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';

import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { AmenitiesBookingScreen } from '@/screens/AmenitiesBookingScreen';
import { AssistantScreen } from '@/screens/AssistantScreen';
import { CommunityScreen } from '@/screens/CommunityScreen';
import { ConstructionProgressScreen } from '@/screens/ConstructionProgressScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { MaintenanceScreen } from '@/screens/MaintenanceScreen';
import { ParkingScreen } from '@/screens/ParkingScreen';
import { ServicesScreen } from '@/screens/ServicesScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { SignInScreen } from '@/screens/SignInScreen';
import { SmartHomeScreen } from '@/screens/SmartHomeScreen';
import { VisitorAccessScreen } from '@/screens/VisitorAccessScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
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
];

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
      direction={isRTL ? 'rtl' : 'ltr'}
      // Web: the browser tab shows the app name, not internal route names like "SignIn".
      documentTitle={{ formatter: () => DOCUMENT_TITLE }}
    >
      <Stack.Navigator
        initialRouteName={getInitialRoute()}
        // Screens push in from the side the reader moves towards.
        screenOptions={{ headerShown: false, animation: isRTL ? 'slide_from_left' : 'default' }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
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
        {/* Register further screens here as their designs are implemented. */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
