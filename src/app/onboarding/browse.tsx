import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';

export default function BrowseFirstScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.surfaceContainerLowest }]}>
      <View style={styles.content}>
        <ThemedText type="title">Explore Khetha first</ThemedText>
        <ThemedText type="default" themeColor="onSurfaceVariant" style={styles.copy}>
          You can browse career guidance without creating an account. Sign in or create an account when you are ready to save your journey.
        </ThemedText>
        <Pressable onPress={() => router.replace('/home')} style={({ pressed }) => [styles.button, { backgroundColor: theme.primary }, pressed && styles.pressed]}>
          <ThemedText type="smallBold" themeColor="onPrimary">Start exploring</ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: Spacing.four },
  content: { flex: 1, justifyContent: 'center', gap: Spacing.three },
  copy: { lineHeight: 22 },
  button: { minHeight: 52, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.85 },
});
