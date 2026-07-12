import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AppProviders } from '@/components/providers/app-providers';
import { useAuthStore } from '@/store/auth-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    void useAuthStore
      .getState()
      .hydrate()
      .finally(() => {
        SplashScreen.hideAsync();
      });
  }, []);

  return (
    <AppProviders>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="tests" />
          <Stack.Screen name="chat/[id]" options={{ headerShown: false, presentation: 'card' }} />
        </Stack>
      </ThemeProvider>
    </AppProviders>
  );
}
