import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { LearnerSubjectScore } from '@/data/subjects';
import { useTheme } from '@/hooks/use-theme';

type SubjectLevelRowProps = {
  score: LearnerSubjectScore;
  onLevelChange: (level: number) => void;
  onRemove: () => void;
};

export function SubjectLevelRow({ score, onLevelChange, onRemove }: SubjectLevelRowProps) {
  const theme = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: theme.surfaceContainerLow }]}>
      <ThemedText type="small" style={styles.name} numberOfLines={1}>
        {score.subject}
      </ThemedText>

      <View style={styles.stepper}>
        <Pressable
          accessibilityLabel="Decrease level"
          onPress={() => onLevelChange(Math.max(1, score.level - 1))}
          style={[styles.stepperButton, { backgroundColor: theme.surfaceContainer }]}>
          <MaterialIcons name="remove" size={14} color={theme.onSurface} />
        </Pressable>
        <ThemedText type="smallBold" style={styles.levelValue}>
          Lvl {score.level}
        </ThemedText>
        <Pressable
          accessibilityLabel="Increase level"
          onPress={() => onLevelChange(Math.min(7, score.level + 1))}
          style={[styles.stepperButton, { backgroundColor: theme.surfaceContainer }]}>
          <MaterialIcons name="add" size={14} color={theme.onSurface} />
        </Pressable>
      </View>

      <Pressable accessibilityLabel="Remove subject" onPress={onRemove} style={styles.removeButton}>
        <MaterialIcons name="close" size={16} color={theme.onSurfaceVariant} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius.md,
  },
  name: {
    flex: 1,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  stepperButton: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelValue: {
    minWidth: 44,
    textAlign: 'center',
  },
  removeButton: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
