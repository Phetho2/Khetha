import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { CareerProgress, CoachReply, SubjectTrend, TermProgressResponse } from '@/data/term-results';
import { useTheme } from '@/hooks/use-theme';

const TREND_META: Record<string, { icon: keyof typeof MaterialIcons.glyphMap; color: string }> = {
  Improving: { icon: 'trending-up', color: '#1b6b51' },
  Declining: { icon: 'trending-down', color: '#ba1a1a' },
  Steady: { icon: 'trending-flat', color: '#6f7973' },
  New: { icon: 'fiber-new', color: '#006a61' },
};

const CAREER_STATUS_META: Record<string, { label: string; icon: keyof typeof MaterialIcons.glyphMap }> = {
  OnTrack: { label: 'On Track', icon: 'task-alt' },
  Close: { label: 'Almost There', icon: 'error-outline' },
  NeedsAttention: { label: 'Needs Attention', icon: 'error-outline' },
  NoMarks: { label: 'No Marks Yet', icon: 'error-outline' },
  NoRequirements: { label: 'No Requirements Listed', icon: 'task-alt' },
};

function SubjectTrendRow({ trend }: { trend: SubjectTrend }) {
  const meta = (trend.trend && TREND_META[trend.trend]) || TREND_META.Steady;

  return (
    <View style={styles.trendRow}>
      <MaterialIcons name={meta.icon} size={16} color={meta.color} />
      <ThemedText type="small" style={styles.trendSubject} numberOfLines={1}>
        {trend.subject}
      </ThemedText>
      <ThemedText type="smallBold" themeColor="onSurfaceVariant">
        {Math.round(trend.latestPercentage)}%
      </ThemedText>
      {trend.change !== null && (
        <ThemedText type="small" style={{ color: meta.color }}>
          {trend.change > 0 ? '+' : ''}
          {Math.round(trend.change)}
        </ThemedText>
      )}
    </View>
  );
}

function CareerProgressCard({ career }: { career: CareerProgress }) {
  const theme = useTheme();
  const meta = (career.status && CAREER_STATUS_META[career.status]) || CAREER_STATUS_META.NeedsAttention;
  const isGood = career.status === 'OnTrack' || career.status === 'NoRequirements';

  return (
    <View style={[styles.careerCard, { backgroundColor: isGood ? theme.primaryContainer : theme.surfaceContainerLow }]}>
      <View style={styles.careerHeader}>
        <ThemedText
          type="smallBold"
          themeColor={isGood ? 'onPrimaryContainer' : 'onSurface'}
          numberOfLines={1}
          style={styles.careerTitle}>
          {career.title ?? 'Untitled Career'}
        </ThemedText>
        <View style={styles.careerStatusRow}>
          <MaterialIcons name={meta.icon} size={14} color={isGood ? theme.onPrimaryContainer : theme.onSurfaceVariant} />
          <ThemedText type="small" themeColor={isGood ? 'onPrimaryContainer' : 'onSurfaceVariant'}>
            {meta.label}
          </ThemedText>
        </View>
      </View>

      {career.requirements && career.requirements.length > 0 && (
        <View style={styles.requirementsList}>
          {career.requirements.map((req) => (
            <ThemedText
              key={req.requiredSubject}
              type="small"
              themeColor={isGood ? 'onPrimaryContainer' : 'onSurfaceVariant'}>
              {req.met ? '✓' : '•'} {req.requiredSubject} ({req.requiredLevelText})
              {req.message ? ` — ${req.message}` : ''}
            </ThemedText>
          ))}
        </View>
      )}
    </View>
  );
}

type TermProgressCardProps = {
  progress: TermProgressResponse;
  coaching: CoachReply | null;
};

export function TermProgressCard({ progress, coaching }: TermProgressCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder }]}>
      <ThemedText type="smallBold" themeColor="primary">
        Your Progress
      </ThemedText>

      {coaching?.summary && (
        <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.summary}>
          {coaching.summary}
        </ThemedText>
      )}

      {coaching?.encouragement && (
        <View style={[styles.encouragementRow, { backgroundColor: theme.secondaryContainer }]}>
          <MaterialIcons name="emoji-events" size={16} color={theme.onSecondaryContainer} />
          <ThemedText type="small" themeColor="onSecondaryContainer" style={styles.encouragementText}>
            {coaching.encouragement}
          </ThemedText>
        </View>
      )}

      {coaching?.focusAreas && coaching.focusAreas.length > 0 && (
        <View style={styles.section}>
          <ThemedText type="smallBold" themeColor="onSurfaceVariant">
            Focus Areas
          </ThemedText>
          {coaching.focusAreas.map((area) => (
            <ThemedText key={area.subject} type="small" themeColor="onSurfaceVariant">
              • {area.subject}: {area.advice}
            </ThemedText>
          ))}
        </View>
      )}

      {progress.subjects && progress.subjects.length > 0 && (
        <View style={styles.section}>
          <ThemedText type="smallBold" themeColor="onSurfaceVariant">
            Subject Trends
          </ThemedText>
          {progress.subjects.map((trend) => (
            <SubjectTrendRow key={trend.subject} trend={trend} />
          ))}
        </View>
      )}

      {progress.careers && progress.careers.length > 0 && (
        <View style={styles.section}>
          <ThemedText type="smallBold" themeColor="onSurfaceVariant">
            Career Goals
          </ThemedText>
          {progress.careers.map((career) => (
            <CareerProgressCard key={career.careerId} career={career} />
          ))}
        </View>
      )}

      {progress.notes && (
        <ThemedText type="small" themeColor="outline" style={styles.notes}>
          {progress.notes}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  summary: {
    lineHeight: 19,
  },
  encouragementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    padding: Spacing.two,
    borderRadius: Radius.md,
  },
  encouragementText: {
    flex: 1,
  },
  section: {
    gap: Spacing.one,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  trendSubject: {
    flex: 1,
  },
  careerCard: {
    borderRadius: Radius.md,
    padding: Spacing.two,
    gap: 4,
  },
  careerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.one,
  },
  careerTitle: {
    flex: 1,
  },
  careerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  requirementsList: {
    gap: 2,
  },
  notes: {
    textAlign: 'center',
  },
});
