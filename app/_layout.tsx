import '@/global.css';
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

/**
 * App root layout that loads application fonts, controls the splash screen visibility, validates the Clerk publishable key, and provides the authenticated navigation stack.
 *
 * Loads PlusJakartaSans font weights and hides the splash screen once fonts are ready; renders nothing until fonts finish loading. Reads `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` and initializes a `ClerkProvider` with `tokenCache`, wrapping the app `Stack` with headers disabled.
 *
 * @returns The root React element composing `ClerkProvider` with the app navigation `Stack`.
 * @throws Error if `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is not set.
 */
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf')
  })

useEffect(() => {
  if (fontsLoaded) {
    SplashScreen.hideAsync()
  }
}, [fontsLoaded])

if (!fontsLoaded) return null;

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

return (
  <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
    <Stack screenOptions={{ headerShown: false }} />
  </ClerkProvider>
);
}