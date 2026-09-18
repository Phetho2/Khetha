import { MaterialIcons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingColors, TOTAL_ONBOARDING_STEPS } from '@/constants/onboarding-theme';
import { MaxContentWidth } from '@/constants/theme';

type OnboardingStepLayoutProps = {
  step: number;
  title: string;
  subtitle: string;
  onBack: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  children: ReactNode;
};

export function OnboardingStepLayout({
  step,
  title,
  subtitle,
  onBack,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled = false,
  children,
}: OnboardingStepLayoutProps) {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.centeredColumn}>
        <View style={styles.headerRow}>
          <Pressable accessibilityLabel="Go back" onPress={onBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={22} color={OnboardingColors.textPrimary} />
          </Pressable>
          <View style={styles.dotsRow}>
            {Array.from({ length: TOTAL_ONBOARDING_STEPS }, (_, index) => index + 1).map((dot) => (
              <View
                key={dot}
                style={[
                  styles.dot,
                  dot === step && styles.dotCurrent,
                  {
                    backgroundColor: dot <= step ? OnboardingColors.accent : OnboardingColors.border,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.stepLabel}>
            Step {step} of {TOTAL_ONBOARDING_STEPS}
          </Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>

        <Pressable
          onPress={onContinue}
          disabled={continueDisabled}
          style={({ pressed }) => [
            styles.continueButton,
            { opacity: continueDisabled ? 0.5 : pressed ? 0.85 : 1 },
          ]}>
          <Text style={styles.continueLabel}>{continueLabel}</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: OnboardingColors.background,
  },
  centeredColumn: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: 22,
    paddingBottom: 20,
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    marginLeft: -10,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 22,
    height: 6,
    borderRadius: 3,
  },
  dotCurrent: {
    width: 30,
  },
  stepLabel: {
    marginLeft: 'auto',
    fontSize: 13,
    color: OnboardingColors.textSecondary,
  },
  titleBlock: {
    gap: 6,
  },
  title: {
    fontSize: 27,
    fontWeight: '600',
    lineHeight: 32,
    color: OnboardingColors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: OnboardingColors.textSecondary,
  },
  scrollContent: {
    gap: 18,
    paddingBottom: 12,
  },
  continueButton: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: OnboardingColors.accent,
  },
  continueLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: OnboardingColors.white,
  },
});
