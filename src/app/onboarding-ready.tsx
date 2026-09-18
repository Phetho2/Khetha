import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OnboardingStepLayout } from '@/components/ncap/onboarding-step-layout';
import { OnboardingColors } from '@/constants/onboarding-theme';
import { useAuth } from '@/contexts/auth-context';
import { useOnboarding } from '@/contexts/onboarding-context';
import { LearnerStage, LocalProfile } from '@/data/local-profile';
import { LocalProfileStorage } from '@/services/local-profile-storage';

const START_HERE_ITEMS = [
  { number: 1, color: OnboardingColors.accent, title: 'Pick your subjects', subtitle: 'Subject Chooser, about 5 minutes' },
  { number: 2, color: '#C53E1F', title: 'Find out what suits you', subtitle: 'Interest questionnaire, 20 questions' },
  { number: 3, color: '#8A6A10', title: 'Meet your career helper', subtitle: 'Ask anything, in your own language' },
];

const STAGE_TO_GRADE: Partial<Record<LearnerStage, number>> = {
  'before-grade-10': 9,
  'grade-10': 10,
  'grade-11': 11,
  'grade-12': 12,
};

function buildChips(profile: LocalProfile): string[] {
  const chips: string[] = [];
  if (profile.language) chips.push(profile.language);
  if (profile.stage) chips.push(profile.stage.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
  if (profile.province) chips.push(profile.town ? `${profile.town}, ${profile.province}` : profile.province);
  if (profile.biggerText) chips.push('Bigger text');
  if (profile.saveData) chips.push('Save my data');
  return chips;
}

export default function OnboardingReadyScreen() {
  const { learner, updateProfile } = useAuth();
  const { complete } = useOnboarding();
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    LocalProfileStorage.get().then(setProfile);
  }, []);

  const firstName = profile?.firstName?.trim();

  function handleStart() {
    setIsFinishing(true);

    const sync =
      learner && profile
        ? updateProfile({
            name: learner.name ?? '',
            grade: (profile.stage && STAGE_TO_GRADE[profile.stage]) ?? learner.grade,
            language: profile.language ?? learner.language ?? 'English',
            track: learner.track ?? 'Undecided',
          }).catch(() => {
            // Best-effort sync — a backend hiccup shouldn't block finishing onboarding.
          })
        : Promise.resolve();

    sync.finally(() => {
      complete();
      router.push('/(tabs)');
      setIsFinishing(false);
    });
  }

  return (
    <OnboardingStepLayout
      step={6}
      title={firstName ? `Sharp, ${firstName}. Your Khetha is ready.` : 'Sharp! Your Khetha is ready.'}
      subtitle="Here is what we set up for you. Change any of it under Profile."
      onBack={() => router.back()}
      onContinue={handleStart}
      continueLabel={isFinishing ? 'Setting up...' : 'Start My Journey'}
      continueDisabled={isFinishing}>
      {profile && (
        <View style={styles.chipRow}>
          {buildChips(profile).map((chip) => (
            <View key={chip} style={styles.chip}>
              <Text style={styles.chipLabel}>{chip}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.sectionLabel}>Start here</Text>
      <View style={styles.list}>
        {START_HERE_ITEMS.map((item) => (
          <View key={item.number} style={styles.startItem}>
            <View style={[styles.numberBadge, { backgroundColor: item.color }]}>
              <Text style={styles.numberLabel}>{item.number}</Text>
            </View>
            <View style={styles.startTextColumn}>
              <Text style={styles.startTitle}>{item.title}</Text>
              <Text style={styles.startSubtitle}>{item.subtitle}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={OnboardingColors.textSecondary} />
          </View>
        ))}
      </View>

      <View style={styles.successBox}>
        <MaterialIcons name="check-circle" size={20} color={OnboardingColors.accent} style={styles.successIcon} />
        <Text style={styles.successText}>
          {learner
            ? 'Your answers are saved to your Khetha account.'
            : 'We saved your answers on this phone. Create an account any time to keep them if you change phones.'}
        </Text>
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    height: 34,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: OnboardingColors.white,
    borderWidth: 1.5,
    borderColor: OnboardingColors.border,
    borderRadius: 17,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: OnboardingColors.textPrimary,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: OnboardingColors.textPrimary,
  },
  list: {
    gap: 10,
  },
  startItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: OnboardingColors.white,
    borderWidth: 1.5,
    borderColor: OnboardingColors.border,
    borderRadius: 14,
  },
  numberBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  numberLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: OnboardingColors.white,
  },
  startTextColumn: {
    flex: 1,
  },
  startTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: OnboardingColors.textPrimary,
  },
  startSubtitle: {
    fontSize: 13,
    color: OnboardingColors.textSecondary,
    marginTop: 2,
  },
  successBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    backgroundColor: OnboardingColors.successBg,
    borderWidth: 1.5,
    borderColor: OnboardingColors.successBorder,
    borderRadius: 14,
  },
  successIcon: {
    marginTop: 1,
  },
  successText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: OnboardingColors.successText,
  },
});
