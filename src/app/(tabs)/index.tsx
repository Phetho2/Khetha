import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DeadlineBanner } from '@/components/ncap/deadline-banner';
import { GreetingSection } from '@/components/ncap/greeting-section';
import { HelplineCard } from '@/components/ncap/helpline-card';
import { OfflineBanner } from '@/components/ncap/offline-banner';
import { PrimaryActionCard } from '@/components/ncap/primary-action-card';
import { QuickActionsGrid } from '@/components/ncap/quick-actions-grid';
import { QuizPromptCard } from '@/components/ncap/quiz-prompt-card';
import { RecommendedCareersCarousel } from '@/components/ncap/recommended-careers-carousel';
import { TopNavBar } from '@/components/ncap/top-nav-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useRoadmap } from '@/hooks/use-roadmap';
import { navigateToJourneyStep } from '@/utils/journey-step-navigation';

export default function HomeScreen() {
  const { learner } = useAuth();
  const { roadmap, roadmapError, retryRoadmap } = useRoadmap();

  const primaryAction = !learner
    ? {
        stepLabel: 'Get Started',
        title: 'Sign in to track your journey',
        progressLabel: '0% Complete',
        progressPercent: 0,
        ctaLabel: 'Sign In / Register',
        onPress: () => router.push('/account'),
      }
    : roadmapError
      ? {
          stepLabel: 'Journey',
          title: roadmapError,
          progressLabel: '—',
          progressPercent: 0,
          ctaLabel: 'Retry',
          onPress: retryRoadmap,
        }
      : !roadmap
        ? {
            stepLabel: 'Journey',
            title: 'Loading your journey...',
            progressLabel: '—',
            progressPercent: 0,
            ctaLabel: 'Please wait',
            onPress: () => {},
          }
        : {
            stepLabel: `Step ${roadmap.currentStepIndex + 1} of ${roadmap.steps.length}`,
            title:
              roadmap.steps[roadmap.currentStepIndex]?.title.replace(/^\d+\.\s*/, '') ?? "You're all caught up!",
            progressLabel: roadmap.progressLabel,
            progressPercent: roadmap.progressPercent,
            ctaLabel: 'Continue Journey',
            onPress: () => navigateToJourneyStep(roadmap.currentStepIndex),
          };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.centeredColumn} edges={['top']}>
        <TopNavBar />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <OfflineBanner />

          <GreetingSection learner={learner} />

          <PrimaryActionCard {...primaryAction} />

          <QuizPromptCard />

          <QuickActionsGrid />

          <RecommendedCareersCarousel />

          <View style={styles.deadlinesSection}>
            <ThemedText type="subtitle" style={styles.deadlinesTitle}>
              Upcoming Deadlines &amp; Support
            </ThemedText>
            <DeadlineBanner
              eyebrow="BURSARY MILESTONE"
              daysLeftLabel="18 Days Left"
              title="NSFAS 2026 Window Opens"
              description="Gather your ID document, parent/guardian consent affidavit, and matric mark statements early."
            />
            <HelplineCard />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  centeredColumn: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  deadlinesSection: {
    gap: Spacing.two,
  },
  deadlinesTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
});
