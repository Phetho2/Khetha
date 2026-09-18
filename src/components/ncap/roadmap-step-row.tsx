import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, ThemeColor } from '@/constants/theme';
import { RoadmapStep } from '@/data/career-roadmap';
import { useTheme } from '@/hooks/use-theme';

type RoadmapStepRowProps = {
  step: RoadmapStep;
  isLast: boolean;
  onPress?: () => void;
};

export function RoadmapStepRow({ step, isLast, onPress }: RoadmapStepRowProps) {
  const theme = useTheme();

  const circleBackground: ThemeColor =
    step.status === 'done' || step.status === 'active'
      ? step.status === 'done'
        ? 'primary'
        : 'secondaryContainer'
      : 'surfaceContainer';
  const circleColor: ThemeColor =
    step.status === 'done' ? 'onPrimary' : step.status === 'active' ? 'onSecondaryContainer' : 'onSurfaceVariant';
  const connectorColor: ThemeColor = step.status === 'done' ? 'primary' : 'surfaceContainerHighest';
  const cardBackground: ThemeColor = step.status === 'active' ? 'surfaceContainerHigh' : 'surfaceContainerLow';
  const titleColor: ThemeColor = step.status === 'active' ? 'primary' : 'onSurface';
  const badgeBackground: ThemeColor =
    step.status === 'done' ? 'primaryContainer' : step.status === 'active' ? 'secondary' : 'surfaceContainer';
  const badgeColor: ThemeColor =
    step.status === 'done' ? 'onPrimaryContainer' : step.status === 'active' ? 'onSecondary' : 'onSurfaceVariant';

  return (
    <View style={styles.row}>
      <View style={styles.railColumn}>
        <View style={[styles.circle, { backgroundColor: theme[circleBackground] }]}>
          <MaterialIcons name={step.icon} size={18} color={theme[circleColor]} />
        </View>
        {!isLast && <View style={[styles.connector, { backgroundColor: theme[connectorColor] }]} />}
      </View>

      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme[cardBackground] },
          pressed && onPress && styles.pressed,
        ]}>
        <View style={styles.cardHeader}>
          <ThemedText type="smallBold" themeColor={titleColor} style={styles.cardTitle}>
            {step.title}
          </ThemedText>
          <View style={styles.cardHeaderEnd}>
            <View style={[styles.badge, { backgroundColor: theme[badgeBackground] }]}>
              <ThemedText type="small" themeColor={badgeColor} style={styles.badgeLabel}>
                {step.badgeLabel}
              </ThemedText>
            </View>
            {onPress && <MaterialIcons name="chevron-right" size={18} color={theme.onSurfaceVariant} />}
          </View>
        </View>
        <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.description}>
          {step.description}
        </ThemedText>

        {step.highlightChips && (
          <View style={styles.chipRow}>
            {step.highlightChips.map((chip) => (
              <View key={chip.label} style={[styles.chip, { backgroundColor: theme.surfaceContainerLowest }]}>
                <MaterialIcons name={chip.icon} size={14} color={theme.primary} />
                <ThemedText type="small" style={styles.chipLabel}>
                  {chip.label}
                </ThemedText>
              </View>
            ))}
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  railColumn: {
    alignItems: 'center',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: {
    width: 2,
    flex: 1,
    minHeight: Spacing.four,
  },
  card: {
    flex: 1,
    padding: Spacing.two,
    borderRadius: Radius.md,
    gap: 2,
    marginBottom: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  cardTitle: {
    flexShrink: 1,
  },
  cardHeaderEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  pressed: {
    opacity: 0.85,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  badgeLabel: {
    fontSize: 11,
    lineHeight: 14,
  },
  description: {
    lineHeight: 18,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  chipLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
});
