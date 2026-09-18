import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OnboardingColors } from '@/constants/onboarding-theme';

type OnboardingSelectRowProps = {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
  variant?: 'radio' | 'checkbox';
  compact?: boolean;
};

export function OnboardingSelectRow({
  title,
  subtitle,
  selected,
  onPress,
  variant = 'radio',
  compact = false,
}: OnboardingSelectRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        compact && styles.rowCompact,
        {
          backgroundColor: selected ? OnboardingColors.selectedBg : OnboardingColors.white,
          borderColor: selected ? OnboardingColors.accent : OnboardingColors.border,
        },
      ]}>
      <View
        style={[
          variant === 'radio' ? styles.radioOuter : styles.checkboxOuter,
          { borderColor: selected ? OnboardingColors.accent : OnboardingColors.border },
          selected && variant === 'checkbox' && { backgroundColor: OnboardingColors.accent },
        ]}>
        {selected && variant === 'radio' && <View style={styles.radioInner} />}
      </View>
      <View style={styles.textColumn}>
        <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderRadius: 14,
  },
  rowCompact: {
    minHeight: 50,
    paddingVertical: 0,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: OnboardingColors.accent,
  },
  checkboxOuter: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    flexShrink: 0,
  },
  textColumn: {
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: OnboardingColors.textPrimary,
  },
  titleCompact: {
    fontSize: 15,
  },
  subtitle: {
    fontSize: 13,
    color: OnboardingColors.textSecondary,
    marginTop: 2,
  },
});
