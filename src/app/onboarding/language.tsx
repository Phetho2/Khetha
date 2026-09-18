import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';

const languages = ['English', 'isiZulu', 'isiXhosa', 'Sesotho', 'Setswana', 'Afrikaans', 'Sepedi', 'Xitsonga', 'Tshivenda', 'siSwati', 'isiNdebele'];

export default function LanguageScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [language, setLanguage] = useState('English');

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.surfaceContainerLowest }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>Choose your language</ThemedText>
          <ThemedText type="subtitle" themeColor="onSurfaceVariant">Choose your language</ThemedText>
        </View>

        <View style={styles.languageGrid}>
          {languages.map((item) => {
            const selected = item === language;
            return (
              <Pressable
                key={item}
                onPress={() => setLanguage(item)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[
                  styles.languageChip,
                  { borderColor: selected ? theme.primary : theme.outlineVariant, backgroundColor: selected ? theme.primary : theme.surfaceContainerLowest },
                ]}
              >
                <ThemedText type="smallBold" themeColor={selected ? 'onPrimary' : 'onSurface'}>
                  {item}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={() => router.push('/onboarding/welcome')}
          style={({ pressed }) => [styles.primaryButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}
        >
          <ThemedText type="smallBold" themeColor="onPrimary">Continue</ThemedText>
          <MaterialIcons name="arrow-forward" size={18} color={theme.onPrimary} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: Spacing.four, paddingTop: Spacing.four, paddingBottom: Spacing.four },
  header: { marginTop: Spacing.four, marginBottom: Spacing.four },
  title: { fontSize: 25, lineHeight: 31, marginBottom: 2 },
  languageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  languageChip: { minHeight: 38, paddingHorizontal: Spacing.three, borderWidth: 1, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  primaryButton: { minHeight: 52, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: Spacing.one, marginTop: 'auto' },
  pressed: { opacity: 0.85 },
});
