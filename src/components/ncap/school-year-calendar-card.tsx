import { MaterialIcons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { CalendarResponse } from '@/data/school-calendar';
import { useTheme } from '@/hooks/use-theme';
import { CalendarService } from '@/services/calendar-service';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

export function SchoolYearCalendarCard({ calendar }: { calendar: CalendarResponse }) {
  const theme = useTheme();
  const nextReminder = calendar.reportCardReminders?.find((reminder) => new Date(reminder.date) > new Date());

  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder }]}>
      <View style={styles.headerRow}>
        <ThemedText type="smallBold" themeColor="primary">
          {calendar.year} School Year Calendar
        </ThemedText>
        <Pressable
          onPress={() => Linking.openURL(CalendarService.getIcsUrl(calendar.year))}
          style={({ pressed }) => [styles.icsButton, { backgroundColor: theme.surfaceContainer }, pressed && styles.pressed]}>
          <MaterialIcons name="download" size={14} color={theme.primary} />
          <ThemedText type="small" themeColor="primary">
            Add to Calendar
          </ThemedText>
        </Pressable>
      </View>

      {calendar.terms && calendar.terms.length > 0 && (
        <View style={styles.termsList}>
          {calendar.terms.map((term) => (
            <View key={term.term} style={styles.termRow}>
              <ThemedText type="small" themeColor="onSurfaceVariant">
                Term {term.term}
              </ThemedText>
              <ThemedText type="small">
                {formatDate(term.opens)} – {formatDate(term.closes)}
              </ThemedText>
            </View>
          ))}
        </View>
      )}

      {nextReminder && (
        <View style={[styles.reminderRow, { backgroundColor: theme.tertiaryContainer }]}>
          <MaterialIcons name="event-available" size={16} color={theme.onTertiaryContainer} />
          <ThemedText type="small" themeColor="onTertiaryContainer" style={styles.reminderText}>
            Next reminder: {formatDate(nextReminder.date)} — {nextReminder.title ?? 'Update your report card'}
          </ThemedText>
        </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  icsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
  },
  termsList: {
    gap: 4,
  },
  termRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    padding: Spacing.two,
    borderRadius: Radius.md,
  },
  reminderText: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
});
