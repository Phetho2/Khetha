import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

export default function OnboardingSplashScreen() {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/onboarding/language'), 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.surfaceContainerLowest }]}>
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/khetha-logo.png')}
          style={styles.logo}
          contentFit="contain"
          accessibilityLabel="Khetha logo"
        />
        <ThemedText type="smallBold" themeColor="onSurface" style={styles.tagline}>
          Make the right choice. Decide your future.
        </ThemedText>

        <View style={styles.loadingArea}>
          <View style={styles.dots}>
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <View style={[styles.dot, { backgroundColor: theme.tertiary }]} />
            <View style={[styles.dot, { backgroundColor: theme.secondaryContainer }]} />
          </View>
          <ThemedText type="small" themeColor="onSurfaceVariant">
            Getting your career guide ready...
          </ThemedText>
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedText type="smallBold" style={styles.footerTitle}>
          National Career Advice Portal
        </ThemedText>
        <ThemedText type="small" themeColor="onSurfaceVariant">
          Department of Higher Education and Training
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: Spacing.four },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 220, height: 122 },
  tagline: { textAlign: 'center', marginTop: Spacing.two, maxWidth: 230 },
  loadingArea: { alignItems: 'center', gap: Spacing.two, marginTop: Spacing.six },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 7 },
  footer: { alignItems: 'center', paddingBottom: Spacing.four },
  footerTitle: { fontSize: 12 },
});
