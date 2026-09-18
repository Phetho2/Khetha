import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { OnboardingScreen } from '@/components/ncap/onboarding-ui';
import { Radius } from '@/constants/theme';
import { useOnboarding } from '@/context/onboarding-context';

const LANGUAGES = ['English', 'isiZulu', 'isiXhosa', 'Sesotho', 'Setswana', 'Afrikaans', 'Sepedi', 'itsonga', 'Tshivenda', 'siSwati', 'isiNdebele'] as const;

type LanguageJourneyProps = {
  onContinue: () => void;
};

export function LanguageJourney({ onContinue }: LanguageJourneyProps) {
  const onboarding = useOnboarding();
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]>((onboarding.language as (typeof LANGUAGES)[number]) || 'English');

  return (
    <OnboardingScreen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Choose your language</Text>
        <Text style={styles.subtitle}>Choose your language</Text>

        <View style={styles.chipWrap}>
          {LANGUAGES.map((item) => {
            const selected = item === language;
            return (
              <Pressable
                key={item}
                accessibilityRole="button"
                onPress={() => setLanguage(item)}
                style={({ pressed }) => [
                  styles.chip,
                  selected && styles.chipSelected,
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue"
          onPress={() => {
            onboarding.setLanguage(language);
            onContinue();
          }}
          style={({ pressed }) => [styles.continueButton, pressed && styles.pressed]}>
          <Text style={styles.continueLabel}>Continue</Text>
        </Pressable>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 24,
  },
  title: {
    color: '#0F2744',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    color: '#3B82F6',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 22,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: '#0F2744',
    borderColor: '#0F2744',
  },
  chipLabel: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  chipLabelSelected: {
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 22,
    paddingBottom: 12,
    paddingTop: 8,
  },
  continueButton: {
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: '#22A45A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.88,
  },
});
