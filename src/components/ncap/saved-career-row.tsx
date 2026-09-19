import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { SavedCareer } from '@/data/saved-careers';
import { useTheme } from '@/hooks/use-theme';

function formatSavedDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function SavedCareerRow({ saved, onPress }: { saved: SavedCareer; onPress: () => void }) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.iconCircle, { backgroundColor: theme.secondaryContainer }]}>
        <MaterialIcons name="bookmark" size={18} color={theme.onSecondaryContainer} />
      </View>
      <View style={styles.details}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {saved.career.title ?? 'Untitled Career'}
        </ThemedText>
        {saved.career.summary && (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
            {saved.career.summary}
          </ThemedText>
        )}
        <ThemedText type="small" themeColor="outline">
          Saved {formatSavedDate(saved.savedAtUtc)}
        </ThemedText>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={theme.onSurfaceVariant} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.two,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    gap: 2,
  },
  pressed: {
    opacity: 0.85,
  },
});
