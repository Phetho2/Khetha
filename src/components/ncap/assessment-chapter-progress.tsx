import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { HollandCodeQuestion, RIASEC_META } from '@/data/assessment-questions';
import { useTheme } from '@/hooks/use-theme';

type Chapter = {
  type: number;
  questions: HollandCodeQuestion[];
};

type AssessmentChapterProgressProps = {
  chapters: Chapter[];
  answers: Record<number, number>;
  currentChapterIndex: number;
};

export function AssessmentChapterProgress({ chapters, answers, currentChapterIndex }: AssessmentChapterProgressProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      {chapters.map((chapter, index) => {
        const answeredCount = chapter.questions.filter((question) => answers[question.id] != null).length;
        const isPast = index < currentChapterIndex;
        const isCurrent = index === currentChapterIndex;
        const fillPercent = isPast ? 100 : isCurrent ? Math.round((answeredCount / chapter.questions.length) * 100) : 0;
        const color = RIASEC_META[chapter.type]?.color ?? theme.primary;

        return (
          <View key={chapter.type} style={[styles.track, { backgroundColor: theme.surfaceContainerHigh }]}>
            <View style={[styles.fill, { width: `${fillPercent}%`, backgroundColor: color }]} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.half,
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
