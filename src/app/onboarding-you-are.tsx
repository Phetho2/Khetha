import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { OnboardingSelectRow } from '@/components/ncap/onboarding-select-row';
import { OnboardingStepLayout } from '@/components/ncap/onboarding-step-layout';
import { OnboardingColors } from '@/constants/onboarding-theme';
import { LearnerStage, STAGE_LABELS } from '@/data/local-profile';
import { LocalProfileStorage } from '@/services/local-profile-storage';

const GRADE_STAGES: LearnerStage[] = ['before-grade-10', 'grade-10', 'grade-11', 'grade-12'];
const OTHER_STAGES: LearnerStage[] = ['college-university', 'looking-for-work', 'parent-guardian', 'teacher-practitioner'];

export default function OnboardingYouAreScreen() {
  const [firstName, setFirstName] = useState('');
  const [stage, setStage] = useState<LearnerStage | null>(null);

  useEffect(() => {
    LocalProfileStorage.get().then((profile) => {
      setFirstName(profile.firstName);
      setStage(profile.stage);
    });
  }, []);

  function handleContinue() {
    LocalProfileStorage.update({ firstName: firstName.trim(), stage }).finally(() => router.push('/onboarding-location'));
  }

  return (
    <OnboardingStepLayout
      step={2}
      title="Tell us about you"
      subtitle="This is how we decide what to show you first. Nothing here is shared with anyone else."
      onBack={() => router.back()}
      onContinue={handleContinue}>
      <View style={styles.field}>
        <Text style={styles.label}>What should we call you?</Text>
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First name"
          placeholderTextColor={OnboardingColors.textSecondary}
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>I am a learner in</Text>
        <View style={styles.grid}>
          {GRADE_STAGES.map((value) => (
            <View key={value} style={styles.gridItem}>
              <OnboardingSelectRow
                compact
                title={STAGE_LABELS[value]}
                selected={stage === value}
                onPress={() => setStage(value)}
              />
            </View>
          ))}
        </View>

        <Text style={[styles.label, styles.orLabel]}>Or I am</Text>
        <View style={styles.list}>
          {OTHER_STAGES.map((value) => (
            <OnboardingSelectRow
              key={value}
              title={STAGE_LABELS[value]}
              selected={stage === value}
              onPress={() => setStage(value)}
            />
          ))}
        </View>
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: OnboardingColors.textPrimary,
  },
  orLabel: {
    marginTop: 4,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  gridItem: {
    width: '47%',
  },
  list: {
    gap: 10,
    marginTop: 4,
  },
});
