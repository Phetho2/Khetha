import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AssessmentFooterNote } from '@/components/ncap/assessment-footer-note';
import { AssessmentProgress } from '@/components/ncap/assessment-progress';
import { AssessmentQuestionCard } from '@/components/ncap/assessment-question-card';
import { AssessmentRatingScale } from '@/components/ncap/assessment-rating-scale';
import { AssessmentResultCard } from '@/components/ncap/assessment-result-card';
import { AssessmentSectionBar } from '@/components/ncap/assessment-section-bar';
import { ScreenHeader } from '@/components/ncap/screen-header';
import { ScreenLoading } from '@/components/ncap/screen-loading';
import { TopNavBar } from '@/components/ncap/top-nav-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { AssessmentResult, HollandCodeQuestion, RIASEC_LABELS } from '@/data/assessment-questions';
import { useAuth } from '@/contexts/auth-context';
import { JOURNEY_STEP } from '@/data/journey';
import { useTheme } from '@/hooks/use-theme';
import { ApiError } from '@/services/api-client';
import { AssessmentService } from '@/services/assessment-service';
import { RoadmapService } from '@/services/roadmap-service';

const AUTO_ADVANCE_DELAY_MS = 400;

export default function CareerJobFitScreen() {
  const theme = useTheme();
  const { learner } = useAuth();
  const [questions, setQuestions] = useState<HollandCodeQuestion[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    AssessmentService.getQuestions()
      .then((data) => {
        if (cancelled) return;
        setLoadError(null);
        setQuestions(data);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setLoadError(error instanceof ApiError ? error.message : 'Something went wrong loading the assessment.');
      });
    return () => {
      cancelled = true;
    };
  }, [loadAttempt]);

  useEffect(() => {
    return () => {
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
    };
  }, []);

  function clearPendingAdvance() {
    if (advanceTimeout.current) {
      clearTimeout(advanceTimeout.current);
      advanceTimeout.current = null;
    }
  }

  function handleRetake() {
    clearPendingAdvance();
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setSubmitError(null);
  }

  function submitAnswers(finalAnswers: Record<number, number>) {
    setIsSubmitting(true);
    setSubmitError(null);
    AssessmentService.submitAnswers(
      Object.entries(finalAnswers).map(([questionId, rating]) => ({ questionId: Number(questionId), rating })),
    )
      .then((data) => {
        setResult(data);
        if (learner) {
          // Best-effort — a roadmap sync failure shouldn't disrupt the result the learner just got.
          RoadmapService.completeStep(JOURNEY_STEP.assess).catch(() => {});
        }
      })
      .catch((error: unknown) => {
        setSubmitError(error instanceof ApiError ? error.message : 'Something went wrong submitting your answers.');
      })
      .finally(() => setIsSubmitting(false));
  }

  function handleRate(questionId: number, rating: number, isLastQuestion: boolean, total: number) {
    Haptics.selectionAsync();
    const updatedAnswers = { ...answers, [questionId]: rating };
    setAnswers(updatedAnswers);

    clearPendingAdvance();
    advanceTimeout.current = setTimeout(() => {
      advanceTimeout.current = null;
      if (isLastQuestion) {
        submitAnswers(updatedAnswers);
      } else {
        setCurrentIndex((index) => Math.min(total - 1, index + 1));
      }
    }, AUTO_ADVANCE_DELAY_MS);
  }

  function goToPrevious() {
    clearPendingAdvance();
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  if (loadError) {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.centeredColumn} edges={['top']}>
          <TopNavBar />
          <View style={styles.errorContainer}>
            <MaterialIcons name="cloud-off" size={32} color={theme.onSurfaceVariant} />
            <ThemedText type="default" themeColor="onSurfaceVariant" style={styles.errorText}>
              {loadError}
            </ThemedText>
            <Pressable
              onPress={() => setLoadAttempt((attempt) => attempt + 1)}
              style={({ pressed }) => [
                styles.retryButton,
                { backgroundColor: theme.primary },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="smallBold" themeColor="onPrimary">
                Retry
              </ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (!questions) {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.centeredColumn} edges={['top']}>
          <TopNavBar />
          <ScreenLoading label="Loading your assessment..." />
        </SafeAreaView>
      </ThemedView>
    );
  }

  const question = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentRating = answers[question.id] ?? null;
  const minutesRemaining = Math.max(1, Math.ceil(((questions.length - currentIndex) * 8) / 60));

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.centeredColumn} edges={['top']}>
        <TopNavBar />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <ScreenHeader title="Career Job Fit" subtitle="Discover careers that match your strengths" />

          {result ? (
            <>
              <AssessmentResultCard result={result} />
              <Pressable
                onPress={handleRetake}
                style={({ pressed }) => [
                  styles.retakeButton,
                  { backgroundColor: theme.surfaceContainer },
                  pressed && styles.pressed,
                ]}>
                <MaterialIcons name="replay" size={18} color={theme.onSurface} />
                <ThemedText type="smallBold">Retake Assessment</ThemedText>
              </Pressable>
            </>
          ) : isSubmitting ? (
            <ScreenLoading label="Calculating your results..." />
          ) : (
            <>
              <AssessmentProgress
                questionNumber={currentIndex + 1}
                totalQuestions={questions.length}
                minutesRemaining={minutesRemaining}
              />

              <Animated.View key={question.id} entering={FadeIn.duration(200)} style={styles.questionGroup}>
                <AssessmentSectionBar sectionLabel={`${RIASEC_LABELS[question.type]} Questions`} />

                <AssessmentQuestionCard categoryEyebrow={RIASEC_LABELS[question.type]} questionText={question.text} />

                <AssessmentRatingScale
                  value={currentRating}
                  onChange={(rating) => handleRate(question.id, rating, isLastQuestion, questions.length)}
                />
              </Animated.View>

              {submitError && (
                <ThemedText type="small" themeColor="error" style={styles.submitError}>
                  {submitError}
                </ThemedText>
              )}

              {currentIndex > 0 && (
                <Pressable
                  onPress={goToPrevious}
                  style={({ pressed }) => [
                    styles.previousButton,
                    { backgroundColor: theme.surfaceContainer },
                    pressed && styles.pressed,
                  ]}>
                  <MaterialIcons name="arrow-back" size={18} color={theme.onSurface} />
                  <ThemedText type="smallBold">Previous</ThemedText>
                </Pressable>
              )}
            </>
          )}

          <AssessmentFooterNote />
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
    paddingTop: Spacing.one,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  questionGroup: {
    gap: Spacing.four,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  errorText: {
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
  },
  pressed: {
    opacity: 0.85,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    height: 48,
    borderRadius: Radius.lg,
  },
  previousButton: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: Spacing.one,
    height: 44,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
  },
  submitError: {
    textAlign: 'center',
  },
});
