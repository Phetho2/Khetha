import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';

export default function AccountScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [consent, setConsent] = useState(false);
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailIsValid = !email.trim() || EMAIL_REGEX.test(email.trim());

    const canContinue = name.trim().length >= 2 && phone.trim().length >= 8 && emailIsValid && smsCode.length === 5 && consent;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.surfaceContainerLowest }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Go back">
          <MaterialIcons name="chevron-left" size={28} color={theme.onSurface} />
        </Pressable>
        <ThemedText type="small" themeColor="onSurfaceVariant">Step 1 of 4</ThemedText>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: theme.surfaceContainer }]}>
        <View style={[styles.progressFill, { backgroundColor: theme.primary, width: '25%' }]} />
      </View>

      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>Create your account</ThemedText>
        <ThemedText type="default" themeColor="onSurfaceVariant">So your results are saved when you come back.</ThemedText>

        <Field label="Full name" value={name} onChangeText={setName} placeholder="Your full name" />
        <Field label="Cell number" value={phone} onChangeText={setPhone} placeholder="+27 82 431 9076" keyboardType="phone-pad" />
        <Field label="Email (optional)" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
        <Field
          label="SMS verification code"
          value={smsCode}
          onChangeText={(value) => setSmsCode(value.replace(/\D/g, '').slice(0, 5))}
          placeholder="Enter your 5-digit code"
          keyboardType="number-pad"
          maxLength={5}
        />

        <Pressable onPress={() => setConsent((value) => !value)} style={styles.consentRow} accessibilityRole="checkbox" accessibilityState={{ checked: consent }}>
          <View style={[styles.checkbox, { backgroundColor: consent ? theme.primary : theme.surfaceContainerLowest, borderColor: consent ? theme.primary : theme.outlineVariant }]}>
            {consent && <MaterialIcons name="check" size={16} color={theme.onPrimary} />}
          </View>
          <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.consentText}>
            I agree that DHET may store my answers to give me career advice. <ThemedText type="smallBold" themeColor="secondary">How we use your data</ThemedText>
          </ThemedText>
        </Pressable>

        <Pressable
          disabled={!canContinue}
          onPress={() => router.push('/onboarding/profile')}
          style={({ pressed }) => [styles.primaryButton, { backgroundColor: canContinue ? theme.primary : theme.surfaceContainerHigh }, pressed && canContinue && styles.pressed]}
        >
          <ThemedText type="smallBold" themeColor={canContinue ? 'onPrimary' : 'onSurfaceVariant'}>Verify and continue</ThemedText>
        </Pressable>
        <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.helper}>We&apos;ll SMS a 5-digit code. No data needed.</ThemedText>
      </View>

      <View style={styles.footer}>
        <ThemedText type="small" themeColor="onSurfaceVariant">Already registered? </ThemedText>
        <Pressable onPress={() => router.replace('/onboarding/login')}>
          <ThemedText type="smallBold" themeColor="secondary" style={styles.underline}>Log in</ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType, maxLength }: {
  label: string; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: 'phone-pad' | 'email-address' | 'number-pad'; maxLength?: number;
}) {
  const theme = useTheme();
  return (
    <View style={styles.field}>
      <ThemedText type="small" themeColor="onSurfaceVariant">{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.outline}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
        style={[styles.input, { color: theme.onSurface, borderColor: theme.outlineVariant, backgroundColor: theme.surfaceContainerLowest }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: Spacing.four },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing.one, paddingBottom: Spacing.one },
  progressTrack: { height: 5, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  content: { flex: 1, paddingTop: Spacing.four, gap: Spacing.two },
  title: { fontSize: 26, lineHeight: 32 },
  field: { gap: Spacing.one, marginTop: Spacing.one },
  input: { height: 54, borderWidth: 1, borderRadius: Radius.lg, paddingHorizontal: Spacing.two, fontSize: 16 },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two, marginTop: Spacing.one },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  consentText: { flex: 1, lineHeight: 18 },
  primaryButton: { height: 52, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.two },
  helper: { textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingBottom: Spacing.four },
  underline: { textDecorationLine: 'underline' },
  pressed: { opacity: 0.85 },
});
