import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { AssessmentSubmissionSummary } from '@/data/assessment-questions';
import { useTheme } from '@/hooks/use-theme';
import { AssessmentService } from '@/services/assessment-service';

export function QuizPromptCard() {
  const theme = useTheme();
  const { learner } = useAuth();
  const [latestResult, setLatestResult] = useState<AssessmentSubmissionSummary | null>(null);

  useEffect(() => {
    if (!learner) return;
    let cancelled = false;
    AssessmentService.getMyAssessments()
      .then((results) => {
        if (!cancelled) setLatestResult(results[0] ?? null);
      })
      .catch(() => {
        // Best-effort personalization — the card still works generically on failure.
      });
    return () => {
      cancelled = true;
    };
  }, [learner]);

  const hasResult = Boolean(learner) && Boolean(latestResult);

  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder }]}>
      <View style={styles.info}>
        <View style={[styles.iconCircle, { backgroundColor: theme.secondaryContainer }]}>
          <MaterialIcons name="explore" size={20} color={theme.onSecondaryContainer} />
        </View>
        <View style={styles.textColumn}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {hasResult ? `Your Holland Code: ${latestResult?.resultCode}` : 'Not sure which career fits you?'}
          </ThemedText>
          <ThemedText type="small" themeColor="onSurfaceVariant" numberOfLines={1}>
            {hasResult ? 'Retake the career quiz any time' : 'Take our 3-minute career quiz'}
          </ThemedText>
        </View>
      </View>
      <Pressable
        onPress={() => router.push('/career-job-fit')}
        style={({ pressed }) => [
          styles.cta,
          { backgroundColor: theme.surfaceContainer },
          pressed && styles.pressed,
        ]}>
        <ThemedText type="smallBold" themeColor="primary">
          {hasResult ? 'Retake' : 'Start quiz'}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexShrink: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flexShrink: 1,
    gap: 1,
  },
  cta: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
  },
  pressed: {
    opacity: 0.85,
  },
});
