import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.surfaceContainerLowest }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Go back">
          <MaterialIcons name="chevron-left" size={28} color={theme.onSurface} />
        </Pressable>
        <ThemedText type="small" themeColor="onSurfaceVariant">Welcome back</ThemedText>
      </View>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>Welcome back</ThemedText>
        <ThemedText type="default" themeColor="onSurfaceVariant">Your saved careers and results are waiting.</ThemedText>

        <TextInput value={identifier} onChangeText={setIdentifier} placeholder="Cell number or email" placeholderTextColor={theme.outline} style={[styles.input, { color: theme.onSurface, borderColor: theme.outlineVariant }]} />
        <View style={styles.passwordRow}>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" placeholderTextColor={theme.outline} style={[styles.passwordInput, { color: theme.onSurface }]} />
          <MaterialIcons name="visibility" size={18} color={theme.outline} />
        </View>

        <Pressable onPress={() => {}} style={styles.forgot}><ThemedText type="smallBold" themeColor="secondary" style={styles.underline}>Forgot password?</ThemedText></Pressable>

        <Pressable onPress={() => router.replace('/home')} style={({ pressed }) => [styles.primaryButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}>
          <ThemedText type="smallBold" themeColor="onPrimary">Log in</ThemedText>
        </Pressable>

        <Pressable onPress={() => {}} style={[styles.outlineButton, { borderColor: theme.outlineVariant }]}>
          <ThemedText type="smallBold">Send me a one-time code instead</ThemedText>
        </Pressable>

        <View style={styles.orRow}><View style={[styles.line, { backgroundColor: theme.outlineVariant }]} /><ThemedText type="small" themeColor="onSurfaceVariant">or</ThemedText><View style={[styles.line, { backgroundColor: theme.outlineVariant }]} /></View>

        <View style={styles.socialRow}>
          {['G', 'f', 'ID'].map((label) => (
            <Pressable key={label} style={[styles.social, { borderColor: theme.outlineVariant }]}><ThemedText type="smallBold">{label}</ThemedText></Pressable>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <ThemedText type="small" themeColor="onSurfaceVariant">New here? </ThemedText>
        <Pressable onPress={() => router.replace('/onboarding/account')}><ThemedText type="smallBold" themeColor="secondary" style={styles.underline}>Create an account</ThemedText></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: Spacing.four },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing.one },
  content: { flex: 1, justifyContent: 'center', gap: Spacing.two },
  title: { fontSize: 27, lineHeight: 33 },
  input: { height: 54, borderWidth: 1, borderRadius: Radius.lg, paddingHorizontal: Spacing.two, fontSize: 16, marginTop: Spacing.two },
  passwordRow: { height: 54, borderWidth: 1, borderColor: '#D5DAE2', borderRadius: Radius.lg, flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.two },
  passwordInput: { flex: 1, fontSize: 16 },
  forgot: { alignSelf: 'flex-end' },
  underline: { textDecorationLine: 'underline' },
  primaryButton: { height: 52, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.two },
  outlineButton: { minHeight: 52, borderWidth: 1, borderRadius: Radius.lg, justifyContent: 'center', paddingHorizontal: Spacing.three },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginVertical: Spacing.two },
  line: { flex: 1, height: 1 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.two },
  social: { width: 42, height: 42, borderWidth: 1, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingBottom: Spacing.four },
  pressed: { opacity: 0.85 },
});
