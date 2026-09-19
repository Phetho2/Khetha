import { MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DetailHeader } from '@/components/ncap/detail-header';
import { SchoolYearCalendarCard } from '@/components/ncap/school-year-calendar-card';
import { TermMarksForm } from '@/components/ncap/term-marks-form';
import { TermProgressCard } from '@/components/ncap/term-progress-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { CalendarResponse } from '@/data/school-calendar';
import { LearnerSubjectScore } from '@/data/subjects';
import { CoachResponse, ReportCardStatusResponse, TermSubjectMark } from '@/data/term-results';
import { useTheme } from '@/hooks/use-theme';
import { ApiError } from '@/services/api-client';
import { CalendarService } from '@/services/calendar-service';
import { SchoolStatus, SubjectPlanStorage } from '@/services/subject-plan-storage';
import { TermResultsService } from '@/services/term-results-service';

const CURRENT_YEAR = new Date().getFullYear();

export default function TermResultsScreen() {
  const theme = useTheme();
  const { learner } = useAuth();
  const [schoolStatus, setSchoolStatus] = useState<SchoolStatus | null | undefined>(undefined);
  const [subjects, setSubjects] = useState<LearnerSubjectScore[]>([]);
  const [status, setStatus] = useState<ReportCardStatusResponse | null>(null);
  const [coach, setCoach] = useState<CoachResponse | null>(null);
  const [calendar, setCalendar] = useState<CalendarResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      SubjectPlanStorage.getSchoolStatus().then(setSchoolStatus);
      SubjectPlanStorage.getSubjects().then(setSubjects);
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (!learner) return;
      let cancelled = false;
      Promise.all([
        TermResultsService.getStatus(),
        TermResultsService.getCoaching(),
        CalendarService.getCalendar(CURRENT_YEAR),
      ])
        .then(([statusResult, coachResult, calendarResult]) => {
          if (cancelled) return;
          setStatus(statusResult);
          setCoach(coachResult);
          setCalendar(calendarResult);
          setError(null);
        })
        .catch((err: unknown) => {
          if (!cancelled) setError(err instanceof ApiError ? err.message : 'Could not load your report card.');
        });
      return () => {
        cancelled = true;
      };
    }, [learner]),
  );

  function handleSubmitMarks(term: number, year: number, marks: TermSubjectMark[]) {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitMessage(null);
    TermResultsService.submitTermResults({ term, year, subjects: marks })
      .then(() => {
        setSubmitMessage(`Term ${term} marks saved.`);
        return TermResultsService.getCoaching()
          .then(setCoach)
          .catch(() => {});
      })
      .catch((err: unknown) => {
        setSubmitError(err instanceof ApiError ? err.message : 'Could not save your marks.');
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <ThemedView style={styles.root}>
      <View style={styles.centeredColumn}>
        <SafeAreaView edges={['top']}>
          <DetailHeader title="Report Card" subtitle="Term Marks & Progress" />
        </SafeAreaView>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {!learner ? (
            <View style={styles.stateBlock}>
              <ThemedText type="default" themeColor="onSurfaceVariant" style={styles.stateText}>
                Sign in to track your term marks and career-fit progress.
              </ThemedText>
              <Pressable
                onPress={() => router.push('/account')}
                style={({ pressed }) => [styles.ctaButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}>
                <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
                  Sign In / Register
                </ThemedText>
              </Pressable>
            </View>
          ) : schoolStatus === undefined ? (
            <ActivityIndicator color={theme.primary} style={styles.loading} />
          ) : schoolStatus !== 'in-school' ? (
            <View style={styles.stateBlock}>
              <MaterialIcons name="school" size={28} color={theme.onSurfaceVariant} />
              <ThemedText type="default" themeColor="onSurfaceVariant" style={styles.stateText}>
                Report cards are for learners still in school. You marked yourself as a school leaver in Subject
                Chooser — change that there if this isn&apos;t right.
              </ThemedText>
            </View>
          ) : (
            <>
              {status && status.missingTerms && status.missingTerms.length > 0 && (
                <View style={[styles.noticeCard, { backgroundColor: theme.tertiaryContainer }]}>
                  <MaterialIcons name="event-busy" size={18} color={theme.onTertiaryContainer} />
                  <ThemedText type="small" themeColor="onTertiaryContainer" style={styles.noticeText}>
                    You haven&apos;t entered marks for{' '}
                    {status.missingTerms.map((m) => `Term ${m.term} ${m.year}`).join(', ')} yet.
                  </ThemedText>
                </View>
              )}

              {subjects.length === 0 ? (
                <View style={styles.stateBlock}>
                  <ThemedText type="default" themeColor="onSurfaceVariant" style={styles.stateText}>
                    Add your subjects in Subject Chooser first, then come back to enter your marks.
                  </ThemedText>
                  <Pressable
                    onPress={() => router.push('/subject-chooser')}
                    style={({ pressed }) => [styles.ctaButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}>
                    <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
                      Go to Subject Chooser
                    </ThemedText>
                  </Pressable>
                </View>
              ) : (
                <View style={[styles.card, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder }]}>
                  <ThemedText type="smallBold" themeColor="primary">
                    Enter This Term&apos;s Marks
                  </ThemedText>
                  <TermMarksForm subjects={subjects} isSubmitting={isSubmitting} onSubmit={handleSubmitMarks} />
                  {submitMessage && (
                    <ThemedText type="small" themeColor="primary" style={styles.centeredText}>
                      {submitMessage}
                    </ThemedText>
                  )}
                  {submitError && (
                    <ThemedText type="small" themeColor="error" style={styles.centeredText}>
                      {submitError}
                    </ThemedText>
                  )}
                </View>
              )}

              {error && (
                <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.centeredText}>
                  {error}
                </ThemedText>
              )}

              {coach && <TermProgressCard progress={coach.progress} coaching={coach.coaching} />}

              {calendar && <SchoolYearCalendarCard calendar={calendar} />}
            </>
          )}
        </ScrollView>
      </View>
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
  scrollContent: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.one,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    padding: Spacing.two,
    borderRadius: Radius.md,
  },
  noticeText: {
    flex: 1,
  },
  loading: {
    paddingVertical: Spacing.five,
  },
  stateBlock: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.three,
  },
  stateText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  centeredText: {
    textAlign: 'center',
  },
  ctaButton: {
    height: 44,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
