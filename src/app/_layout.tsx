import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '@/contexts/auth-context';
import { OnboardingProvider, useOnboarding } from '@/contexts/onboarding-context';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { hasSeenWelcome } = useOnboarding();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!hasSeenWelcome}>
        <Stack.Screen name="welcome" />
      </Stack.Protected>

      {/* Everything past Welcome, including the personalization screens — those
          are plain routes navigated to explicitly (first-run from Welcome, or
          any time after a fresh registration), not a separate gated phase. */}
      <Stack.Protected guard={hasSeenWelcome}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="career-detail" options={{ presentation: 'card' }} />
        <Stack.Screen name="shortlist" options={{ presentation: 'card' }} />
        <Stack.Screen name="account" options={{ presentation: 'modal' }} />
        <Stack.Screen name="onboarding-language" />
        <Stack.Screen name="onboarding-you-are" />
        <Stack.Screen name="onboarding-location" />
        <Stack.Screen name="onboarding-goals" />
        <Stack.Screen name="onboarding-access" />
        <Stack.Screen name="onboarding-ready" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <OnboardingProvider>
          <AnimatedSplashOverlay />
          <RootNavigator />
        </OnboardingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
