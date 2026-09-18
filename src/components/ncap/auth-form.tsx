import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { LANGUAGE_OPTIONS, TRACK_OPTIONS } from '@/data/auth';
import { useTheme } from '@/hooks/use-theme';
import { ApiError } from '@/services/api-client';

type Mode = 'login' | 'register';

export function AuthForm({ onSuccess }: { onSuccess: (mode: Mode) => void }) {
  const theme = useTheme();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState('');
  const [language, setLanguage] = useState(LANGUAGE_OPTIONS[0]);
  const [track, setTrack] = useState(TRACK_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    setError(null);

    if (mode === 'register') {
      const gradeNumber = Number(grade);
      if (!grade || gradeNumber < 8 || gradeNumber > 12) {
        setError('Please enter a grade between 8 and 12.');
        return;
      }
    }

    setIsSubmitting(true);

    const promise =
      mode === 'login'
        ? login({ email: email.trim(), password })
        : register({
            name: name.trim(),
            email: email.trim(),
            password,
            grade: Number(grade),
            language,
            track,
          });

    promise
      .then(() => onSuccess(mode))
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <>
      <View style={styles.modeSwitch}>
        <Pressable
          onPress={() => setMode('login')}
          style={[styles.modeTab, mode === 'login' && { backgroundColor: theme.primary }]}>
          <ThemedText type="smallBold" style={{ color: mode === 'login' ? theme.onPrimary : theme.onSurface }}>
            Log In
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setMode('register')}
          style={[styles.modeTab, mode === 'register' && { backgroundColor: theme.primary }]}>
          <ThemedText type="smallBold" style={{ color: mode === 'register' ? theme.onPrimary : theme.onSurface }}>
            Register
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.form}>
        {mode === 'register' && (
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full name"
            placeholderTextColor={theme.onSurfaceVariant}
            style={[styles.input, { color: theme.onSurface, backgroundColor: theme.surfaceContainerLow }]}
          />
        )}
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={theme.onSurfaceVariant}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[styles.input, { color: theme.onSurface, backgroundColor: theme.surfaceContainerLow }]}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password (min 8 characters)"
          placeholderTextColor={theme.onSurfaceVariant}
          secureTextEntry
          style={[styles.input, { color: theme.onSurface, backgroundColor: theme.surfaceContainerLow }]}
        />

        {mode === 'register' && (
          <>
            <TextInput
              value={grade}
              onChangeText={setGrade}
              placeholder="Grade (8-12)"
              placeholderTextColor={theme.onSurfaceVariant}
              keyboardType="number-pad"
              style={[styles.input, { color: theme.onSurface, backgroundColor: theme.surfaceContainerLow }]}
            />

            <ThemedText type="smallBold" themeColor="onSurfaceVariant">
              Language
            </ThemedText>
            <View style={styles.chipRow}>
              {LANGUAGE_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setLanguage(option)}
                  style={[styles.chip, { backgroundColor: language === option ? theme.primary : theme.surfaceContainer }]}>
                  <ThemedText type="small" style={{ color: language === option ? theme.onPrimary : theme.onSurface }}>
                    {option}
                  </ThemedText>
                </Pressable>
              ))}
            </View>

            <ThemedText type="smallBold" themeColor="onSurfaceVariant">
              Track
            </ThemedText>
            <View style={styles.chipRow}>
              {TRACK_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setTrack(option)}
                  style={[styles.chip, { backgroundColor: track === option ? theme.primary : theme.surfaceContainer }]}>
                  <ThemedText type="small" style={{ color: track === option ? theme.onPrimary : theme.onSurface }}>
                    {option}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </View>

      {error && (
        <ThemedText type="small" themeColor="error" style={styles.error}>
          {error}
        </ThemedText>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={({ pressed }) => [
          styles.submitButton,
          { backgroundColor: theme.primary, opacity: isSubmitting ? 0.6 : 1 },
          pressed && styles.pressed,
        ]}>
        <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
          {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
        </ThemedText>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  modeSwitch: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  modeTab: {
    flex: 1,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: Spacing.two,
  },
  input: {
    height: 48,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  chip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
  },
  error: {
    textAlign: 'center',
  },
  submitButton: {
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
