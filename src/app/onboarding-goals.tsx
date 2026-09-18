import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { OnboardingSelectRow } from '@/components/ncap/onboarding-select-row';
import { OnboardingStepLayout } from '@/components/ncap/onboarding-step-layout';
import { GOAL_LABELS, OnboardingGoal } from '@/data/local-profile';
import { LocalProfileStorage } from '@/services/local-profile-storage';

const ALL_GOALS: OnboardingGoal[] = ['choose-subjects', 'find-career', 'study-options', 'find-job', 'help-someone-else'];

export default function OnboardingGoalsScreen() {
  const [goals, setGoals] = useState<OnboardingGoal[]>([]);

  useEffect(() => {
    LocalProfileStorage.get().then((profile) => setGoals(profile.goals));
  }, []);

  function toggleGoal(goal: OnboardingGoal) {
    setGoals((current) => (current.includes(goal) ? current.filter((entry) => entry !== goal) : [...current, goal]));
  }

  function handleContinue() {
    LocalProfileStorage.update({ goals }).finally(() => router.push('/onboarding-access'));
  }

  return (
    <OnboardingStepLayout
      step={4}
      title="What can we help you with?"
      subtitle="Choose as many as you like. Your home screen is built from this, and you can change it later."
      onBack={() => router.back()}
      onContinue={handleContinue}>
      <View style={styles.list}>
        {ALL_GOALS.map((goal) => (
          <OnboardingSelectRow
            key={goal}
            variant="checkbox"
            title={GOAL_LABELS[goal].title}
            subtitle={GOAL_LABELS[goal].subtitle}
            selected={goals.includes(goal)}
            onPress={() => toggleGoal(goal)}
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
