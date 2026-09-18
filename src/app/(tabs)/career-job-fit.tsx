import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AssessmentChapterIntro } from '@/components/ncap/assessment-chapter-intro';
import { AssessmentChapterProgress } from '@/components/ncap/assessment-chapter-progress';
import { AssessmentFooterNote } from '@/components/ncap/assessment-footer-note';
import { AssessmentQuestionCard } from '@/components/ncap/assessment-question-card';
import { AssessmentRatingScale } from '@/components/ncap/assessment-rating-scale';
import { AssessmentResultCard } from '@/components/ncap/assessment-result-card';
import { ScreenHeader } from '@/components/ncap/screen-header';
import { ScreenLoading } from '@/components/ncap/screen-loading';
import { TopNavBar } from '@/components/ncap/top-nav-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { AssessmentResult, HollandCodeQuestion, RIASEC_META } from '@/data/assessment-questions';
import { JOURNEY_STEP } from '@/data/journey';
import { useTheme } from '@/hooks/use-theme';
import { ApiError } from '@/services/api-client';
import { AssessmentService } from '@/services/assessment-service';
import { RoadmapService } from '@/services/roadmap-service';

const AUTO_ADVANCE_DELAY_MS = 400;

type Chapter = {
  type: number;
  questions: HollandCodeQuestion[];
};

function groupIntoChapters(questions: HollandCodeQuestion[]): Chapter[] {
  const byType = new Map<number, HollandCodeQuestion[]>();
  for (const question of questions) {
    const list = byType.get(question.type) ?? [];
    list.push(question);
    byType.set(question.type, list);
  }
  return Array.from(byType.entries())
    .sort(([a], [b]) => a - b)
    .map(([type, list]) => ({ type, questions: list }));
}

export default function CareerJobFitScreen() {
  const theme = useTheme();
  const { learner } = useAuth();
  const [questions, setQuestions] = useState<HollandCodeQuestion[] | null>(null);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [questionIndexInChapter, setQuestionIndexInChapter] = useState(0);
  const [showChapterIntro, setShowChapterIntro] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const chapters = useMemo(() => (questions ? groupIntoChapters(questions) : []), [questions]);

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
    setChapterIndex(0);
    setQuestionIndexInChapter(0);
    setShowChapterIntro(true);
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

  function handleRate(
    questionId: number,
    rating: number,
    isLastQuestionInChapter: boolean,
    isLastChapter: boolean,
  ) {
    Haptics.selectionAsync();
    const updatedAnswers = { ...answers, [questionId]: rating };
    setAnswers(updatedAnswers);

    clearPendingAdvance();
    advanceTimeout.current = setTimeout(() => {
      advanceTimeout.current = null;
      if (isLastQuestionInChapter && isLastChapter) {
        submitAnswers(updatedAnswers);
      } else if (isLastQuestionInChapter) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setChapterIndex((index) => index + 1);
        setQuestionIndexInChapter(0);
        setShowChapterIntro(true);
      } else {
        setQuestionIndexInChapter((index) => index + 1);
      }
    }, AUTO_ADVANCE_DELAY_MS);
  }

  function goToPrevious() {
    clearPendingAdvance();
    if (questionIndexInChapter > 0) {
      setQuestionIndexInChapter((index) => index - 1);
    } else if (chapterIndex > 0) {
      const previousChapter = chapters[chapterIndex - 1];
      setChapterIndex((index) => index - 1);
      setQuestionIndexInChapter(previousChapter.questions.length - 1);
    }
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

  if (!questions || chapters.length === 0) {
    return (
      <ThemedView style={styles.root}>
        <SafeAreaView style={styles.centeredColumn} edges={['top']}>
          <TopNavBar />
          <ScreenLoading label="Loading your assessment..." />
        </SafeAreaView>
      </ThemedView>
    );
  }

  const currentChapter = chapters[chapterIndex];
  const currentQuestion = currentChapter.questions[questionIndexInChapter];
  const isLastQuestionInChapter = questionIndexInChapter === currentChapter.questions.length - 1;
  const isLastChapter = chapterIndex === chapters.length - 1;
  const currentRating = answers[currentQuestion.id] ?? null;
  const canGoBack = chapterIndex > 0 || questionIndexInChapter > 0;

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.centeredColumn} edges={['top']}>
        <TopNavBar />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {result ? (
            <>
              <ScreenHeader title="Career Job Fit" subtitle="Discover careers that match your strengths" />
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
              <AssessmentFooterNote />
            </>
          ) : isSubmitting ? (
            <ScreenLoading label="Calculating your results..." />
          ) : showChapterIntro ? (
            <AssessmentChapterIntro
              chapterNumber={chapterIndex + 1}
              totalChapters={chapters.length}
              meta={RIASEC_META[currentChapter.type]}
              questionCount={currentChapter.questions.length}
              isFirst={chapterIndex === 0}
              onStart={() => setShowChapterIntro(false)}
            />
          ) : (
            <>
              <AssessmentChapterProgress chapters={chapters} answers={answers} currentChapterIndex={chapterIndex} />

              <Animated.View key={currentQuestion.id} entering={SlideInRight.duration(220)} style={styles.questionGroup}>
                <AssessmentQuestionCard
                  categoryEyebrow={RIASEC_META[currentChapter.type].label}
                  questionText={currentQuestion.text}
                />

                <AssessmentRatingScale
                  value={currentRating}
                  onChange={(rating) =>
                    handleRate(currentQuestion.id, rating, isLastQuestionInChapter, isLastChapter)
                  }
                />
              </Animated.View>

              {submitError && (
                <ThemedText type="small" themeColor="error" style={styles.submitError}>
                  {submitError}
                </ThemedText>
              )}

              {canGoBack && (
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
