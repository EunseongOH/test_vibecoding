import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppStore } from '../store/useAppStore';
import "../global.css";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { session, isInitialized, initialize } = useAppStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const isOnboarding = segments[0] === 'onboarding';
    
    // Auth redirection logic
    if (!session && !inAuthGroup && !isOnboarding) {
      router.replace('/onboarding');
    } else if (session && (inAuthGroup || isOnboarding || segments.length === 0)) {
      router.replace('/(tabs)');
    }
  }, [session, isInitialized, segments]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="detail/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
