import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CareerDetailModal } from '@/components/ncap/career-detail-modal';
import { DetailHeader } from '@/components/ncap/detail-header';
import { SavedCareerRow } from '@/components/ncap/saved-career-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { MatchedCareer } from '@/data/careers';
import { SavedCareer } from '@/data/saved-careers';
import { useSavedCareers } from '@/hooks/use-saved-careers';
import { useTheme } from '@/hooks/use-theme';
import { ApiError } from '@/services/api-client';
import { SavedCareersService } from '@/services/saved-careers-service';

export default function ShortlistScreen() {
  const theme = useTheme();
  const { learner } = useAuth();
  const { toggleSaved } = useSavedCareers();
  const [saved, setSaved] = useState<SavedCareer[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<MatchedCareer | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!learner) return;
      let cancelled = false;
      SavedCareersService.getSavedCareers()
        .then((result) => {
          if (!cancelled) {
            setSaved(result);
            setError(null);
          }
        })
        .catch((err: unknown) => {
          if (!cancelled) setError(err instanceof ApiError ? err.message : 'Could not load your shortlist.');
        });
      return () => {
        cancelled = true;
      };
    }, [learner]),
  );

  // Every career here is already saved, so a toggle from this screen's modal
  // is always an unsave — remove the row once the API call resolves.
  function handleUnsave(careerId: number): Promise<void> {
    return toggleSaved(careerId).then(() => {
      setSaved((current) => current?.filter((entry) => entry.career.id !== careerId) ?? current);
    });
  }

  return (
    <ThemedView style={styles.root}>
      <View style={styles.centeredColumn}>
        <SafeAreaView edges={['top']}>
          <DetailHeader title="Shortlist" subtitle="Careers You're Considering" />
        </SafeAreaView>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {!learner ? (
            <View style={styles.stateBlock}>
              <ThemedText type="default" themeColor="onSurfaceVariant" style={styles.stateText}>
                Sign in to save careers and build your shortlist.
              </ThemedText>
              <Pressable
                onPress={() => router.push('/account')}
                style={({ pressed }) => [styles.ctaButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}>
                <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
                  Sign In / Register
                </ThemedText>
              </Pressable>
            </View>
          ) : error ? (
            <View style={styles.stateBlock}>
              <ThemedText type="default" themeColor="onSurfaceVariant" style={styles.stateText}>
                {error}
              </ThemedText>
            </View>
          ) : saved === null ? (
            <ActivityIndicator color={theme.primary} style={styles.loading} />
          ) : saved.length === 0 ? (
            <View style={styles.stateBlock}>
              <ThemedText type="default" themeColor="onSurfaceVariant" style={styles.stateText}>
                No careers saved yet. Explore your recommendations on the Home tab and tap &quot;Save to
                Shortlist&quot; on any career you&apos;re considering.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.list}>
              {saved.map((entry) => (
                <SavedCareerRow key={entry.id} saved={entry} onPress={() => setSelected({ ...entry.career })} />
              ))}
            </View>
          )}
        </ScrollView>
      </View>

      <CareerDetailModal
        career={selected}
        onClose={() => setSelected(null)}
        isSaved={true}
        onToggleSave={() => (selected ? handleUnsave(selected.id) : Promise.resolve())}
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
  list: {
    gap: Spacing.two,
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
  ctaButton: {
    height: 44,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
