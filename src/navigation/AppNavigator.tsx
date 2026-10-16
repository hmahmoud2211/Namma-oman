import { DarkTheme, DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';

import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { ConstructionProgressScreen } from '@/screens/ConstructionProgressScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { SignInScreen } from '@/screens/SignInScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import type { RootStackParamList } from '@/types/navigation.types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const ROUTE_NAMES: readonly (keyof RootStackParamList)[] = [
  'Welcome',
  'SignIn',
  'Home',
  'ConstructionProgress',
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
    <NavigationContainer theme={navigationTheme} direction={isRTL ? 'rtl' : 'ltr'}>
      <Stack.Navigator
        initialRouteName={getInitialRoute()}
        // Screens push in from the side the reader moves towards.
        screenOptions={{ headerShown: false, animation: isRTL ? 'slide_from_left' : 'default' }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ConstructionProgress" component={ConstructionProgressScreen} />
        {/* Register further screens here as their designs are implemented. */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
