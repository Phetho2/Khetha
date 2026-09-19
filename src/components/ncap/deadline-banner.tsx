import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type DeadlineTone = 'funding' | 'deadline';

type DeadlineBannerProps = {
  eyebrow: string;
  daysLeftLabel: string;
  title: string;
  description: string;
  tone?: DeadlineTone;
};

export function DeadlineBanner({ eyebrow, daysLeftLabel, title, description, tone = 'deadline' }: DeadlineBannerProps) {
  const theme = useTheme();
  // Funding (e.g. NSFAS) reads as money/teal, so it doesn't get mistaken for an
  // application closing date — those stay on the amber "deadline" tone.
  const container = tone === 'funding' ? theme.secondaryContainer : theme.tertiaryContainer;
  const onContainer = tone === 'funding' ? theme.onSecondaryContainer : theme.onTertiaryContainer;
  const accent = tone === 'funding' ? theme.secondary : theme.tertiary;
  const icon = tone === 'funding' ? 'savings' : 'event';

  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder }]}>
      <View style={[styles.iconCircle, { backgroundColor: container }]}>
        <MaterialIcons name={icon} size={20} color={onContainer} />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <ThemedText type="smallBold" style={[styles.eyebrow, { color: accent }]}>
            {eyebrow}
          </ThemedText>
          <View style={[styles.daysPill, { backgroundColor: container }]}>
            <ThemedText type="smallBold" style={{ color: onContainer }}>
              {daysLeftLabel}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="smallBold" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {description}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexShrink: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.one,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 0.6,
  },
  daysPill: {
    paddingHorizontal: Spacing.one,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
  },
});
