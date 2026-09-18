import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { OnboardingSelectRow } from '@/components/ncap/onboarding-select-row';
import { OnboardingStepLayout } from '@/components/ncap/onboarding-step-layout';
import { LANGUAGE_OPTIONS } from '@/data/auth';
import { LocalProfileStorage } from '@/services/local-profile-storage';

export default function OnboardingLanguageScreen() {
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    LocalProfileStorage.get().then((profile) => setLanguage(profile.language));
  }, []);

  function handleContinue() {
    LocalProfileStorage.update({ language }).finally(() => router.push('/onboarding-you-are'));
  }

  return (
    <OnboardingStepLayout
      step={1}
      title="What language should we use?"
      subtitle="We'll show Khetha in this language. You can change it any time."
      onBack={() => router.back()}
      onContinue={handleContinue}>
      <View style={styles.list}>
        {LANGUAGE_OPTIONS.map((option) => (
          <OnboardingSelectRow
            key={option}
            title={option}
            selected={language === option}
            onPress={() => setLanguage(option)}
          />
        ))}
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
});
