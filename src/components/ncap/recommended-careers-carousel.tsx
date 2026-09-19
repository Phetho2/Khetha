import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { MatchedCareer } from '@/data/careers';
import { useTheme } from '@/hooks/use-theme';
import { ApiError } from '@/services/api-client';
import { CareersService } from '@/services/careers-service';
import { SubjectPlanStorage } from '@/services/subject-plan-storage';

import { CareerCard } from './career-card';
import { CareerDetailModal } from './career-detail-modal';

type LoadState = 'loading' | 'ready' | 'needs-input' | 'error';

export function RecommendedCareersCarousel() {
  const theme = useTheme();
  const { learner } = useAuth();
  const [state, setState] = useState<LoadState>('loading');
  const [careers, setCareers] = useState<MatchedCareer[]>([]);
  const [subtitle, setSubtitle] = useState('Top careers in our directory');
  const [selected, setSelected] = useState<MatchedCareer | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState('loading');
      const subjects = await SubjectPlanStorage.getSubjects();

      if (subjects.length === 0 && !learner) {
        if (!cancelled) setState('needs-input');
        return;
      }

      try {
        const [directory, matchResult] = await Promise.all([
          CareersService.getCareers(),
          CareersService.matchCareers(subjects),
        ]);
        if (cancelled) return;

        const directoryById = new Map(directory.map((career) => [career.id, career]));
        const merged: MatchedCareer[] = (matchResult.matches ?? [])
          .map((match) => {
            const full = directoryById.get(match.careerId);
            if (!full) return null;
            const result: MatchedCareer = {
              ...full,
              overallScore: match.overallScore,
              subjectFitScore: match.subjectFitScore,
              riasecFitScore: match.riasecFitScore,
            };
            return result;
          })
          .filter((entry): entry is MatchedCareer => entry !== null)
          .sort((a, b) => b.overallScore - a.overallScore);

        if (merged.length === 0) {
          setState('needs-input');
          return;
        }

        setSubtitle(
          matchResult.usedSubjects && matchResult.usedRiasec
            ? 'Based on your subjects and job-fit quiz'
            : matchResult.usedRiasec
              ? 'Based on your job-fit quiz results'
              : matchResult.usedSubjects
                ? 'Based on your chosen subjects'
                : 'Top careers in our directory',
        );
        setCareers(merged);
        setState('ready');
      } catch (error) {
        if (cancelled) return;
        setState(error instanceof ApiError && error.status === 400 ? 'needs-input' : 'error');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [learner]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerColumn}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recommended For You
          </ThemedText>
          {state === 'ready' && (
            <ThemedText type="small" themeColor="outline">
              {subtitle}
            </ThemedText>
          )}
        </View>
      </View>

      {state === 'loading' && <ActivityIndicator color={theme.primary} style={styles.loading} />}

      {state === 'error' && (
        <ThemedText type="small" themeColor="outline">
          Couldn&apos;t load your recommendations right now.
        </ThemedText>
      )}

      {state === 'needs-input' && (
        <Pressable
          onPress={() => router.push('/subject-chooser')}
          style={({ pressed }) => [
            styles.promptCard,
            { backgroundColor: theme.surfaceContainerLow, borderColor: theme.cardBorder },
            pressed && styles.pressed,
          ]}>
          <MaterialIcons name="auto-awesome" size={22} color={theme.primary} />
          <View style={styles.promptText}>
            <ThemedText type="smallBold">Add your subjects to get matched</ThemedText>
            <ThemedText type="small" themeColor="onSurfaceVariant">
              Tell us what you&apos;re studying (or take the job-fit quiz) for personalised career picks.
            </ThemedText>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={theme.onSurfaceVariant} />
        </Pressable>
      )}

      {state === 'ready' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}>
          {careers.map((career) => (
            <CareerCard key={career.id} career={career} onExplore={() => setSelected(career)} />
          ))}
        </ScrollView>
      )}

      <CareerDetailModal career={selected} onClose={() => setSelected(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.one,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  headerColumn: {
    flexShrink: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  carouselContent: {
    gap: Spacing.two,
    paddingVertical: Spacing.half,
  },
  loading: {
    paddingVertical: Spacing.five,
  },
  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
  },
  promptText: {
    flex: 1,
    gap: 2,
  },
  pressed: {
    opacity: 0.85,
  },
});
