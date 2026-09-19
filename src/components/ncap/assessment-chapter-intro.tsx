import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { RiasecMeta } from '@/data/assessment-questions';
import { useTheme } from '@/hooks/use-theme';

const HOW_IT_WORKS = [
  { icon: 'touch-app', text: 'Rate each statement from Strongly Disagree to Strongly Agree — go with your gut.' },
  { icon: 'check-circle-outline', text: 'There are no right or wrong answers.' },
  { icon: 'view-agenda', text: '6 short sections, about 5 minutes in total.' },
  { icon: 'insights', text: 'Your results power the career matches you see across Khetha.' },
] as const;

type AssessmentChapterIntroProps = {
  chapterNumber: number;
  totalChapters: number;
  meta: RiasecMeta;
  questionCount: number;
  isFirst: boolean;
  onStart: () => void;
};

export function AssessmentChapterIntro({
  chapterNumber,
  totalChapters,
  meta,
  questionCount,
  isFirst,
  onStart,
}: AssessmentChapterIntroProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {isFirst && (
        <View style={[styles.instructionsCard, { backgroundColor: theme.surfaceContainerLow }]}>
          <View style={styles.instructionsHeader}>
            <MaterialIcons name="quiz" size={18} color={theme.primary} />
            <ThemedText type="smallBold" themeColor="primary">
              What Is This Test?
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.instructionsIntro}>
            This is the Holland Code (RIASEC) career interest quiz, used by DHET&apos;s National Career Advice
            Portal to match your natural strengths to real careers and qualifications.
          </ThemedText>
          <View style={styles.instructionsList}>
            {HOW_IT_WORKS.map((item) => (
              <View key={item.text} style={styles.instructionRow}>
                <MaterialIcons name={item.icon} size={16} color={theme.onSurfaceVariant} />
                <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.instructionText}>
                  {item.text}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      )}

      {!isFirst && (
        <View style={styles.celebrateRow}>
          <MaterialIcons name="celebration" size={16} color={meta.color} />
          <ThemedText type="smallBold" style={{ color: meta.color }}>
            Section {chapterNumber - 1} complete!
          </ThemedText>
        </View>
      )}

      <View style={[styles.iconCircle, { backgroundColor: `${meta.color}22` }]}>
        <MaterialIcons name={meta.icon as keyof typeof MaterialIcons.glyphMap} size={36} color={meta.color} />
      </View>

      <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.eyebrow}>
        Section {chapterNumber} of {totalChapters}
      </ThemedText>
      <ThemedText type="title" style={styles.label}>
        {meta.label}
      </ThemedText>
      <ThemedText themeColor="onSurfaceVariant" style={styles.blurb}>
        {meta.blurb}
      </ThemedText>
      <ThemedText type="small" themeColor="outline">
        {questionCount} quick questions
      </ThemedText>

      <Pressable
        onPress={onStart}
        style={({ pressed }) => [styles.startButton, { backgroundColor: meta.color }, pressed && styles.pressed]}>
        <ThemedText type="smallBold" style={styles.startLabel}>
          {isFirst ? "Let's Go" : 'Continue'}
        </ThemedText>
        <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.three,
  },
  instructionsCard: {
    alignSelf: 'stretch',
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  instructionsIntro: {
    lineHeight: 19,
  },
  instructionsList: {
    gap: Spacing.one,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.one,
  },
  instructionText: {
    flex: 1,
    lineHeight: 18,
  },
  celebrateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.two,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  label: {
    fontSize: 26,
    lineHeight: 32,
  },
  blurb: {
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 4,
    marginBottom: Spacing.one,
    maxWidth: 320,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    height: 52,
    paddingHorizontal: Spacing.five,
    borderRadius: Radius.full,
    marginTop: Spacing.four,
  },
  startLabel: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.85,
  },
});
