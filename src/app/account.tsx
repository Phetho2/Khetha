import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthForm } from '@/components/ncap/auth-form';
import { HelplineCard } from '@/components/ncap/helpline-card';
import { ScreenHeader } from '@/components/ncap/screen-header';
import { ScreenLoading } from '@/components/ncap/screen-loading';
import { ThemeToggleButton } from '@/components/ncap/theme-toggle-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';

export default function AccountScreen() {
  const theme = useTheme();
  const { learner, isLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function handleLogout() {
    setIsLoggingOut(true);
    logout().finally(() => setIsLoggingOut(false));
  }

  if (isLoading) {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.centeredColumn}>
          <ScreenLoading label="Loading your account..." />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.centeredColumn}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.closeRow}>
            <ThemeToggleButton />
            <Pressable
              accessibilityLabel="Close"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.closeButton, { backgroundColor: theme.surfaceContainer }, pressed && styles.pressed]}>
              <MaterialIcons name="close" size={20} color={theme.onSurface} />
            </Pressable>
          </View>

          {learner ? (
            <>
              <ScreenHeader title="My Account" subtitle="Your Khetha profile" />

              <View style={[styles.card, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder }]}>
                <View style={styles.profileRow}>
                  <ThemedText type="smallBold" themeColor="onSurfaceVariant">Name</ThemedText>
                  <ThemedText type="default">{learner.name}</ThemedText>
                </View>
                <View style={styles.profileRow}>
                  <ThemedText type="smallBold" themeColor="onSurfaceVariant">Email</ThemedText>
                  <ThemedText type="default">{learner.email}</ThemedText>
                </View>
                <View style={styles.profileRow}>
                  <ThemedText type="smallBold" themeColor="onSurfaceVariant">Grade</ThemedText>
                  <ThemedText type="default">{learner.grade || 'Not set'}</ThemedText>
                </View>
                <View style={styles.profileRow}>
                  <ThemedText type="smallBold" themeColor="onSurfaceVariant">Language</ThemedText>
                  <ThemedText type="default">{learner.language}</ThemedText>
                </View>
                <View style={styles.profileRow}>
                  <ThemedText type="smallBold" themeColor="onSurfaceVariant">Track</ThemedText>
                  <ThemedText type="default">{learner.track}</ThemedText>
                </View>
              </View>

              <HelplineCard />

              <Pressable
                onPress={handleLogout}
                disabled={isLoggingOut}
                style={({ pressed }) => [
                  styles.submitButton,
                  { backgroundColor: theme.surfaceContainer, opacity: isLoggingOut ? 0.6 : 1 },
                  pressed && styles.pressed,
                ]}>
                <ThemedText type="smallBold">{isLoggingOut ? 'Logging out...' : 'Log Out'}</ThemedText>
              </Pressable>
            </>
          ) : (
            <>
              <ScreenHeader title="My Account" subtitle="Save your assessment results, roadmap and saved careers" />
              <AuthForm
                onSuccess={(mode) => (mode === 'register' ? router.push('/onboarding-language') : router.back())}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  centeredColumn: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  closeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  submitButton: {
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
