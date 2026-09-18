import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { SavedCareersService } from '@/services/saved-careers-service';

export function OfflineBanner() {
  const theme = useTheme();
  const { learner } = useAuth();
  const [savedCount, setSavedCount] = useState<number | null>(null);

  useEffect(() => {
    if (!learner) return;
    let cancelled = false;
    SavedCareersService.getSavedCareers()
      .then((saved) => {
        if (!cancelled) setSavedCount(saved.length);
      })
      .catch(() => {
        // Best-effort — the banner just doesn't render without a learner or a count.
      });
    return () => {
      cancelled = true;
    };
  }, [learner]);

  if (!learner || savedCount === null) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceContainerLow }]}>
      <View style={styles.info}>
        <View style={[styles.iconCircle, { backgroundColor: theme.secondaryContainer }]}>
          <MaterialIcons name="bookmark" size={16} color={theme.onSecondaryContainer} />
        </View>
        <View style={styles.textColumn}>
          <ThemedText type="smallBold" themeColor="secondary">
            {savedCount} Saved Career{savedCount === 1 ? '' : 's'}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Synced to your Khetha account
          </ThemedText>
        </View>
      </View>
      <View style={[styles.syncPill, { backgroundColor: theme.surfaceContainerHighest }]}>
        <ThemedText type="smallBold" themeColor="primary">
          Synced
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius.lg,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexShrink: 1,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flexShrink: 1,
    gap: 2,
  },
  syncPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
});
