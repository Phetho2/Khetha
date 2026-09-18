import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Field, Onboard, OnboardingScreen, PrimaryButton, StepHeader } from '@/components/ncap/onboarding-ui';
import { useOnboarding } from '@/context/onboarding-context';

export default function CreateAccountScreen() {
  const router = useRouter();
  const onboarding = useOnboarding();
  const [fullName, setFullName] = useState(onboarding.fullName);
  const [cell, setCell] = useState(onboarding.cell);
  const [email, setEmail] = useState(onboarding.email || 'you@example.com');
  const [verificationCode, setVerificationCode] = useState('');
  const [consent, setConsent] = useState(true);
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailIsValid = !email.trim() || EMAIL_REGEX.test(email.trim());

  return (
    <OnboardingScreen>
      <StepHeader step={1} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.lede}>So your results are saved when you come back.</Text>

        <View style={styles.fields}>
          <Field label="Full name" value={fullName} onChangeText={setFullName} />
          <Field label="Cell number" value={cell} onChangeText={setCell} keyboardType="phone-pad" />
          <Field label="Email" optional value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Field
            label="Verification code"
            value={verificationCode}
            onChangeText={(value: string) => setVerificationCode(value.replace(/\D/g, '').slice(0, 5))}
            placeholder="Enter your 5-digit code"
            keyboardType="number-pad"
            maxLength={5}
          />
        </View>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: consent }}
          onPress={() => setConsent((value) => !value)}
          style={styles.consentRow}>
          <View style={[styles.checkbox, consent && styles.checkboxOn]}>
            {consent ? <Text style={styles.checkMark}>✓</Text> : null}
          </View>
          <Text style={styles.consentCopy}>
            I agree that DHET may store my answers to give me career advice.{' '}
            <Text style={styles.link}>How we use your data</Text>
          </Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Verify and continue"
            disabled={!consent || !fullName.trim() || !cell.trim() || !emailIsValid || verificationCode.length !== 5}
          onPress={() => {
            onboarding.setAccount({ fullName, cell, email });
            router.push('/onboarding/profile');
          }}
        />
        <Text style={styles.hint}>We'll SMS a 5-digit code. No data needed.</Text>
          <Text style={styles.footerText}>
          Already registered?{' '}
          <Text style={styles.link} onPress={() => router.push('/onboarding/login')}>
            Log in
          </Text>
        </Text>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 16,
  },
  title: {
    color: Onboard.navy,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
  },
  lede: {
    marginTop: 6,
    color: Onboard.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  fields: {
    marginTop: 22,
    gap: 14,
  },
  consentRow: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Onboard.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxOn: {
    backgroundColor: Onboard.green,
  },
  checkMark: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  consentCopy: {
    flex: 1,
    color: Onboard.body,
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    color: Onboard.green,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: 22,
    paddingBottom: 16,
    paddingTop: 8,
    gap: 10,
  },
  hint: {
    textAlign: 'center',
    color: Onboard.muted,
    fontSize: 13,
  },
  footerText: {
    textAlign: 'center',
    color: Onboard.muted,
    fontSize: 14,
    marginTop: 4,
  },
});
