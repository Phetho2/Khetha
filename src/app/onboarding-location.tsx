import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { OnboardingStepLayout } from '@/components/ncap/onboarding-step-layout';
import { OnboardingColors } from '@/constants/onboarding-theme';
import { SA_PROVINCES } from '@/data/local-profile';
import { LocalProfileStorage } from '@/services/local-profile-storage';

export default function OnboardingLocationScreen() {
  const [province, setProvince] = useState<string | null>(null);
  const [town, setTown] = useState('');

  useEffect(() => {
    LocalProfileStorage.get().then((profile) => {
      setProvince(profile.province);
      setTown(profile.town);
    });
  }, []);

  function handleContinue() {
    LocalProfileStorage.update({ province, town: town.trim() }).finally(() => router.push('/onboarding-goals'));
  }

  return (
    <OnboardingStepLayout
      step={3}
      title="Where are you?"
      subtitle="This helps us show colleges, universities and support services near you."
      onBack={() => router.back()}
      onContinue={handleContinue}>
      <View style={styles.field}>
        <Text style={styles.label}>Province</Text>
        <View style={styles.chipRow}>
          {SA_PROVINCES.map((option) => {
            const selected = province === option;
            return (
              <Pressable
                key={option}
                onPress={() => setProvince(option)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected ? OnboardingColors.selectedBg : OnboardingColors.white,
                    borderColor: selected ? OnboardingColors.accent : OnboardingColors.border,
                  },
                ]}>
                <Text style={styles.chipLabel}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Town or suburb (optional)</Text>
        <TextInput
          value={town}
          onChangeText={setTown}
          placeholder="e.g. Tzaneen"
          placeholderTextColor={OnboardingColors.textSecondary}
          style={styles.input}
        />
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: OnboardingColors.textPrimary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderRadius: 14,
  },
  chipLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: OnboardingColors.textPrimary,
  },
  input: {
    height: 52,
    paddingHorizontal: 14,
    backgroundColor: OnboardingColors.white,
    borderWidth: 1.5,
    borderColor: OnboardingColors.border,
    borderRadius: 14,
    fontSize: 16,
    color: OnboardingColors.textPrimary,
  },
});
