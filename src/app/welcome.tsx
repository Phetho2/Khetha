import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useOnboarding } from '@/contexts/onboarding-context';
import { useTheme } from '@/hooks/use-theme';

const VALUE_PROPS: { icon: keyof typeof MaterialIcons.glyphMap; text: string }[] = [
  { icon: 'chat', text: 'Chat with Ask Khetha AI about subjects, careers and funding' },
  { icon: 'psychology-alt', text: 'Take a job-fit assessment to discover careers that match you' },
  { icon: 'route', text: 'Track your personal journey from school to your first qualification' },
];

export default function WelcomeScreen() {
  const theme = useTheme();
  const { isComplete, markWelcomeSeen } = useOnboarding();

  function handleGetStarted() {
    markWelcomeSeen();
    router.push(isComplete ? '/(tabs)' : '/onboarding-language');
  }

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.centeredColumn}>
        <View style={styles.content}>
          <Image
            source={require('@/assets/images/khetha-splash-logo.png')}
            style={styles.logo}
            contentFit="contain"
          />

          <View style={styles.valueProps}>
            {VALUE_PROPS.map((item) => (
              <View key={item.text} style={styles.valuePropRow}>
                <View style={[styles.valuePropIcon, { backgroundColor: theme.primaryContainer }]}>
                  <MaterialIcons name={item.icon} size={18} color={theme.onPrimaryContainer} />
                </View>
                <ThemedText type="default" style={styles.valuePropText}>
                  {item.text}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={handleGetStarted}
            style={({ pressed }) => [
              styles.getStartedButton,
              { backgroundColor: theme.primary },
              pressed && styles.pressed,
            ]}>
            <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
              Get Started
            </ThemedText>
            <MaterialIcons name="arrow-forward" size={18} color={theme.onPrimary} />
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FAFCFB',
  },
  centeredColumn: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    justifyContent: 'space-between',
    padding: Spacing.four,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.six,
  },
  logo: {
    width: 260,
    height: 138,
  },
  valueProps: {
    width: '100%',
    gap: Spacing.three,
  },
  valuePropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  valuePropIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valuePropText: {
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    width: '100%',
  },
  getStartedButton: {
    height: 52,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  pressed: {
    opacity: 0.85,
  },
});
