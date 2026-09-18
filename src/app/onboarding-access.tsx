import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OnboardingSelectRow } from '@/components/ncap/onboarding-select-row';
import { OnboardingStepLayout } from '@/components/ncap/onboarding-step-layout';
import { OnboardingToggleRow } from '@/components/ncap/onboarding-toggle-row';
import { OnboardingColors } from '@/constants/onboarding-theme';
import { DisabilityStatus } from '@/data/local-profile';
import { LocalProfileStorage } from '@/services/local-profile-storage';

const DISABILITY_OPTIONS: { value: DisabilityStatus; label: string }[] = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
  { value: 'rather-not-say', label: 'Rather not say' },
];

export default function OnboardingAccessScreen() {
  const [biggerText, setBiggerText] = useState(true);
  const [readToMe, setReadToMe] = useState(true);
  const [saveData, setSaveData] = useState(true);
  const [workOffline, setWorkOffline] = useState(false);
  const [disabilityStatus, setDisabilityStatus] = useState<DisabilityStatus | null>('no');

  useEffect(() => {
    LocalProfileStorage.get().then((profile) => {
      setBiggerText(profile.biggerText);
      setReadToMe(profile.readToMe);
      setSaveData(profile.saveData);
      setWorkOffline(profile.workOffline);
      setDisabilityStatus(profile.disabilityStatus);
    });
  }, []);

  function handleContinue() {
    LocalProfileStorage.update({ biggerText, readToMe, saveData, workOffline, disabilityStatus }).finally(() =>
      router.push('/onboarding-ready'),
    );
  }

  return (
    <OnboardingStepLayout
      step={5}
      title="Make the app work for you"
      subtitle="Set these now or later. Everything here stays on your phone unless you ask us to save it."
      onBack={() => router.back()}
      onContinue={handleContinue}>
      <View style={styles.list}>
        <OnboardingToggleRow
          title="Bigger text"
          subtitle="Larger, bolder writing everywhere"
          value={biggerText}
          onToggle={() => setBiggerText((value) => !value)}
        />
        <OnboardingToggleRow
          title="Read to me"
          subtitle="The app reads questions and answers out loud"
          value={readToMe}
          onToggle={() => setReadToMe((value) => !value)}
        />
        <OnboardingToggleRow
          title="Save my data"
          subtitle="Fewer pictures, no video on mobile data"
          value={saveData}
          onToggle={() => setSaveData((value) => !value)}
        />
        <OnboardingToggleRow
          title="Work offline"
          subtitle="Download careers and subjects to use without data"
          value={workOffline}
          onToggle={() => setWorkOffline((value) => !value)}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Are you a person living with a disability?</Text>
        <Text style={styles.helperText}>Optional. It helps us show support services and accessible study options.</Text>
        <View style={styles.disabilityRow}>
          {DISABILITY_OPTIONS.map((option) => (
            <View key={option.value} style={styles.disabilityOption}>
              <OnboardingSelectRow
                compact
                title={option.label}
                selected={disabilityStatus === option.value}
                onPress={() => setDisabilityStatus(option.value)}
              />
            </View>
          ))}
        </View>
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  field: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: OnboardingColors.textPrimary,
  },
  helperText: {
    fontSize: 13,
    color: OnboardingColors.textSecondary,
    marginTop: -6,
  },
  disabilityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  disabilityOption: {
    flex: 1,
  },
});
