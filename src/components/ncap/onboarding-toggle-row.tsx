import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OnboardingColors } from '@/constants/onboarding-theme';

type OnboardingToggleRowProps = {
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
};

export function OnboardingToggleRow({ title, subtitle, value, onToggle }: OnboardingToggleRowProps) {
  return (
    <Pressable onPress={onToggle} style={styles.row}>
      <View style={styles.textColumn}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View
        style={[
          styles.track,
          { backgroundColor: value ? OnboardingColors.accent : OnboardingColors.toggleOff },
          value ? styles.trackOn : styles.trackOff,
        ]}>
        <View style={styles.thumb} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 62,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: OnboardingColors.white,
    borderWidth: 1.5,
    borderColor: OnboardingColors.border,
    borderRadius: 14,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: OnboardingColors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: OnboardingColors.textSecondary,
    marginTop: 2,
  },
  track: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 3,
    flexShrink: 0,
    flexDirection: 'row',
  },
  trackOn: {
    justifyContent: 'flex-end',
  },
  trackOff: {
    justifyContent: 'flex-start',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: OnboardingColors.white,
  },
});
