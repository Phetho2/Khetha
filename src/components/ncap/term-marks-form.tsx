import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { LearnerSubjectScore } from '@/data/subjects';
import { TermSubjectMark } from '@/data/term-results';
import { useTheme } from '@/hooks/use-theme';

const TERMS = [1, 2, 3, 4];
const CURRENT_YEAR = new Date().getFullYear();

type TermMarksFormProps = {
  subjects: LearnerSubjectScore[];
  isSubmitting: boolean;
  onSubmit: (term: number, year: number, marks: TermSubjectMark[]) => void;
};

export function TermMarksForm({ subjects, isSubmitting, onSubmit }: TermMarksFormProps) {
  const theme = useTheme();
  const [term, setTerm] = useState(1);
  const [percentages, setPercentages] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    setError(null);
    const marks: TermSubjectMark[] = [];
    for (const subject of subjects) {
      const raw = percentages[subject.subject];
      if (!raw || !raw.trim()) continue;
      const percentage = Number(raw);
      if (Number.isNaN(percentage) || percentage < 0 || percentage > 100) {
        setError(`Enter a valid percentage (0-100) for ${subject.subject}.`);
        return;
      }
      marks.push({ subject: subject.subject, percentage });
    }
    if (marks.length === 0) {
      setError('Enter at least one subject mark.');
      return;
    }
    onSubmit(term, CURRENT_YEAR, marks);
  }

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold" themeColor="onSurfaceVariant">
        Term
      </ThemedText>
      <View style={styles.termRow}>
        {TERMS.map((option) => (
          <Pressable
            key={option}
            onPress={() => setTerm(option)}
            style={[
              styles.termChip,
              { backgroundColor: term === option ? theme.primary : theme.surfaceContainer },
            ]}>
            <ThemedText type="smallBold" style={{ color: term === option ? theme.onPrimary : theme.onSurface }}>
              Term {option}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedText type="smallBold" themeColor="onSurfaceVariant" style={styles.sectionLabel}>
        Your Marks ({CURRENT_YEAR})
      </ThemedText>
      <View style={styles.subjectList}>
        {subjects.map((subject) => (
          <View key={subject.subject} style={styles.subjectRow}>
            <ThemedText type="small" style={styles.subjectName} numberOfLines={1}>
              {subject.subject}
            </ThemedText>
            <View style={[styles.percentInput, { backgroundColor: theme.surfaceContainerLow }]}>
              <TextInput
                value={percentages[subject.subject] ?? ''}
                onChangeText={(text) => setPercentages((current) => ({ ...current, [subject.subject]: text }))}
                placeholder="—"
                placeholderTextColor={theme.onSurfaceVariant}
                keyboardType="number-pad"
                maxLength={3}
                style={[styles.percentText, { color: theme.onSurface }]}
              />
              <ThemedText type="small" themeColor="onSurfaceVariant">
                %
              </ThemedText>
            </View>
          </View>
        ))}
      </View>

      {error && (
        <ThemedText type="small" themeColor="error" style={styles.error}>
          {error}
        </ThemedText>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={({ pressed }) => [
          styles.submitButton,
          { backgroundColor: theme.primary, opacity: isSubmitting ? 0.6 : 1 },
          pressed && styles.pressed,
        ]}>
        <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
          {isSubmitting ? 'Saving...' : 'Save Term Marks'}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  termRow: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  termChip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
  },
  sectionLabel: {
    marginTop: Spacing.one,
  },
  subjectList: {
    gap: Spacing.one,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  subjectName: {
    flex: 1,
  },
  percentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 84,
    height: 40,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
  },
  percentText: {
    flex: 1,
    fontSize: 15,
    textAlign: 'right',
  },
  error: {
    textAlign: 'center',
  },
  submitButton: {
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.one,
  },
  pressed: {
    opacity: 0.85,
  },
});
