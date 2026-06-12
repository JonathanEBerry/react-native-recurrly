import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';

/**
 * Layout component that gates auth-scoped routes and redirects authenticated users.
 *
 * Renders nothing while auth state is loading, redirects signed-in users to "/(tabs)", and renders an auth navigation stack (headers hidden) for unauthenticated users.
 *
 * @returns A React element: `null` while auth is loading, a `<Redirect href="/(tabs)" />` for signed-in users, or a `<Stack screenOptions={{ headerShown: false }} />` for unauthenticated users.
 */
export default function AuthRoutesLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
