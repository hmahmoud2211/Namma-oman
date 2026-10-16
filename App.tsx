import { Asset, useAssets } from 'expo-asset';
import { loadAsync as loadFontsAsync, useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { deferredImages, startupImages } from '@/constants/images';
import { AppProvider } from '@/context/AppContext';
import { LocaleProvider, loadArabicFonts, type Locale } from '@/context/LocaleContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { AppNavigator } from '@/navigation/AppNavigator';
import { deferredFontAssets, startupFontAssets } from '@/theme/typography';

/**
 * Development only: `EXPO_PUBLIC_INITIAL_LOCALE=ar npx expo start` starts in Arabic, so the
 * screens before Home (where the EN | AR switch is) can be checked in Arabic too.
 */
const initialLocale: Locale =
  __DEV__ && process.env.EXPO_PUBLIC_INITIAL_LOCALE === 'ar' ? 'ar' : 'en';

const STARTUP_IMAGES = [...startupImages];

// Keep the native splash up until the first screen's fonts and images are ready, so nothing
// flashes in a fallback font or pops in after the screen appears.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts(startupFontAssets);
  const [startupAssets, startupAssetsError] = useAssets(STARTUP_IMAGES);
  const [initialLocaleReady, setInitialLocaleReady] = useState(initialLocale === 'en');

  useEffect(() => {
    if (initialLocale === 'ar') {
      loadArabicFonts()
        .catch(() => undefined)
        .then(() => setInitialLocaleReady(true));
    }
  }, []);

  // On a load error, continue (system fonts, image loads on its own) rather than hang on the splash.
  const isReady =
    (fontsLoaded || fontError !== null) &&
    (startupAssets !== undefined || startupAssetsError !== undefined) &&
    initialLocaleReady;

  useEffect(() => {
    if (!isReady) return;
    SplashScreen.hide();
    // Load the other screens' fonts and images while the user is on the first one.
    loadFontsAsync(deferredFontAssets).catch(() => undefined);
    Asset.loadAsync([...deferredImages]).catch(() => undefined);
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <LocaleProvider initialLocale={initialLocale}>
        <ThemeProvider>
          <AppProvider>
            <ToastProvider>
              <AppNavigator />
            </ToastProvider>
          </AppProvider>
        </ThemeProvider>
      </LocaleProvider>
    </SafeAreaProvider>
  );
}
