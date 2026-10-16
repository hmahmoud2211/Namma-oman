import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from '@/context/AppContext';
import { LocaleProvider, type Locale } from '@/context/LocaleContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppNavigator } from '@/navigation/AppNavigator';
import { fontAssets } from '@/theme/typography';

/**
 * Development only: `EXPO_PUBLIC_INITIAL_LOCALE=ar npx expo start` starts in Arabic, so the
 * screens before Home (where the EN | AR switch is) can be checked in Arabic too.
 */
const initialLocale: Locale =
  __DEV__ && process.env.EXPO_PUBLIC_INITIAL_LOCALE === 'ar' ? 'ar' : 'en';

// Keep the native splash up until fonts are ready, so text never flashes in a fallback font.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  // On a font error, continue with system fonts rather than hanging on the splash.
  const isReady = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hide();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <LocaleProvider initialLocale={initialLocale}>
        <ThemeProvider>
          <AppProvider>
            <AppNavigator />
          </AppProvider>
        </ThemeProvider>
      </LocaleProvider>
    </SafeAreaProvider>
  );
}
