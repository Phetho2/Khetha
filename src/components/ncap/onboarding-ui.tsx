import type { ReactNode } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

export const Onboard = {
  page: '#FFFFFF',
  navy: '#132B4F',
  body: '#334155',
  muted: '#64748B',
  border: '#DCE5EF',
  green: '#0B8068',
  greenBright: '#20B978',
  amber: '#F5B942',
  cream: '#FFF9EE',
  track: '#E7EEF5',
} as const;

export function OnboardingScreen({ children }: { children: ReactNode }) {
  return <SafeAreaView style={styles.screen}>{children}</SafeAreaView>;
}

export function StepHeader({ step, total = 4, onBack }: { step: number; total?: number; onBack: () => void }) {
  return (
    <View style={styles.stepHeader}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onBack} style={styles.backButton}>
        <Text style={styles.back}>‹</Text>
      </Pressable>
      <Text style={styles.step}>Step {step} of {total}</Text>
      <View style={styles.stepFill} />
    </View>
  );
}

export function PrimaryButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={[styles.primary, disabled && styles.disabled]}>
      <Text style={styles.primaryLabel}>{label}</Text>
    </Pressable>
  );
}

export function Field({ label, value, onChangeText, placeholder, keyboardType, optional, maxLength, ...rest }: TextInputProps & { label: string; optional?: boolean }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}{optional ? ' (optional)' : ''}</Text>
      <TextInput {...rest} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#94A3B8" keyboardType={keyboardType} maxLength={maxLength} style={styles.input} />
    </View>
  );
}

export function Chip({ label, selected, onPress, removable = false }: { label: string; selected: boolean; onPress: () => void; removable?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}{removable && selected ? ' ×' : ''}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Onboard.page },
  stepHeader: { minHeight: 48, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center' },
  backButton: { width: 40 },
  back: { color: Onboard.navy, fontSize: 32, lineHeight: 34 },
  step: { flex: 1, textAlign: 'center', color: Onboard.muted, fontSize: 13, fontWeight: '700' },
  stepFill: { width: 40 },
  primary: { minHeight: 52, borderRadius: 14, backgroundColor: Onboard.green, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  disabled: { opacity: 0.45 },
  primaryLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  field: { gap: 6 },
  label: { color: Onboard.muted, fontSize: 13, fontWeight: '700' },
  input: { minHeight: 52, borderWidth: 1, borderColor: Onboard.border, borderRadius: 14, paddingHorizontal: 14, color: Onboard.navy, fontSize: 16 },
  chip: { minHeight: 38, paddingHorizontal: 13, borderRadius: 999, borderWidth: 1, borderColor: Onboard.border, alignItems: 'center', justifyContent: 'center' },
  chipSelected: { backgroundColor: Onboard.green, borderColor: Onboard.green },
  chipLabel: { color: Onboard.navy, fontSize: 13, fontWeight: '700' },
  chipLabelSelected: { color: '#FFFFFF' },
});
