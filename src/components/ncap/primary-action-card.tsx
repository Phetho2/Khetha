import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useThemePreference } from '@/contexts/theme-context';
import { useTheme } from '@/hooks/use-theme';

type PrimaryActionCardProps = {
  stepLabel: string;
  title: string;
  progressLabel: string;
  progressPercent: number;
  ctaLabel: string;
  onPress: () => void;
};

export function PrimaryActionCard({
  stepLabel,
  title,
  progressLabel,
  progressPercent,
  ctaLabel,
  onPress,
}: PrimaryActionCardProps) {
  const theme = useTheme();
  const { scheme } = useThemePreference();
  // theme.onPrimary pairs with `primary`, not `primaryContainer` — in dark mode
  // that leaves these two low-contrast against this card's dark green background.
  const emphasisColor = scheme === 'dark' ? '#ffffff' : theme.onPrimary;

  return (
    <View style={[styles.card, { backgroundColor: theme.primaryContainer }]}>
      <ThemedText type="smallBold" style={[styles.stepLabel, { color: theme.onPrimaryContainer }]}>
        {stepLabel.toUpperCase()}
      </ThemedText>
      <ThemedText type="subtitle" style={[styles.title, { color: emphasisColor }]}>
        {title}
      </ThemedText>

      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <ThemedText type="small" style={{ color: theme.onPrimaryContainer }}>
            Career roadmap progress
          </ThemedText>
          <ThemedText type="smallBold" style={{ color: emphasisColor }}>
            {progressLabel}
          </ThemedText>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: theme.onPrimary + '2e' }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercent}%`, backgroundColor: theme.onPrimary },
            ]}
          />
        </View>
      </View>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.cta,
          { backgroundColor: theme.surfaceContainerLowest },
          pressed && styles.pressed,
        ]}>
        <ThemedText type="smallBold" themeColor="primary">
          {ctaLabel}
        </ThemedText>
        <MaterialIcons name="arrow-forward" size={18} color={theme.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  stepLabel: {
    fontSize: 12,
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
  },
  progressSection: {
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTrack: {
    height: 6,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  cta: {
    height: 44,
    marginTop: Spacing.one,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  pressed: {
    opacity: 0.85,
  },
});
