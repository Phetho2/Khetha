import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CareerDetailModal } from '@/components/ncap/career-detail-modal';
import { CareerListRow } from '@/components/ncap/career-list-row';
import { DetailHeader } from '@/components/ncap/detail-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { Career, MatchedCareer } from '@/data/careers';
import { useSavedCareers } from '@/hooks/use-saved-careers';
import { useTheme } from '@/hooks/use-theme';
import { ApiError } from '@/services/api-client';
import { CareersService } from '@/services/careers-service';

export default function CareersDirectoryScreen() {
  const theme = useTheme();
  const { savedIds, toggleSaved } = useSavedCareers();
  const [careers, setCareers] = useState<Career[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<MatchedCareer | null>(null);

  useEffect(() => {
    let cancelled = false;
    CareersService.getCareers()
      .then((result) => {
        if (!cancelled) setCareers(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Could not load the careers directory.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const trimmedQuery = query.trim().toLowerCase();
  const visibleCareers = useMemo(() => {
    if (!careers) return [];
    if (!trimmedQuery) return careers;
    return careers.filter(
      (career) =>
        (career.title ?? '').toLowerCase().includes(trimmedQuery) ||
        (career.summary ?? '').toLowerCase().includes(trimmedQuery),
    );
  }, [careers, trimmedQuery]);

  return (
    <ThemedView style={styles.root}>
      <View style={styles.centeredColumn}>
        <SafeAreaView edges={['top']}>
          <DetailHeader title="Careers" subtitle={careers ? `${careers.length} In The Directory` : 'Loading...'} />
        </SafeAreaView>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.searchBox, { backgroundColor: theme.surfaceContainerLow }]}>
            <MaterialIcons name="search" size={18} color={theme.onSurfaceVariant} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search careers..."
              placeholderTextColor={theme.onSurfaceVariant}
              style={[styles.searchInput, { color: theme.onSurface }]}
            />
            {query.length > 0 && (
              <Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')}>
                <MaterialIcons name="close" size={16} color={theme.onSurfaceVariant} />
              </Pressable>
            )}
          </View>

          {error ? (
            <View style={styles.stateBlock}>
              <MaterialIcons name="cloud-off" size={28} color={theme.onSurfaceVariant} />
              <ThemedText type="default" themeColor="onSurfaceVariant" style={styles.stateText}>
                {error}
              </ThemedText>
            </View>
          ) : careers === null ? (
            <ActivityIndicator color={theme.primary} style={styles.loading} />
          ) : visibleCareers.length === 0 ? (
            <View style={styles.stateBlock}>
              <ThemedText type="default" themeColor="onSurfaceVariant" style={styles.stateText}>
                No careers match &quot;{query}&quot;.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.list}>
              {visibleCareers.map((career) => (
                <CareerListRow
                  key={career.id}
                  career={career}
                  isSaved={savedIds.has(career.id)}
                  onToggleSave={() => toggleSaved(career.id)}
                  onPress={() => setSelected(career)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>

      <CareerDetailModal
        career={selected}
        onClose={() => setSelected(null)}
        isSaved={selected !== null && savedIds.has(selected.id)}
        onToggleSave={() => (selected ? toggleSaved(selected.id) : Promise.resolve())}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  centeredColumn: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.one,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    height: 44,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  list: {
    gap: Spacing.one,
  },
  loading: {
    paddingVertical: Spacing.five,
  },
  stateBlock: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.three,
  },
  stateText: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
