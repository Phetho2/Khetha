import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { GuideEpisode } from '@/data/guide';
import { useTheme } from '@/hooks/use-theme';
import { GuideService } from '@/services/guide-service';

// Curated pick of episodes from the "After School" playlist to spotlight on Home.
const FEATURED_EPISODE_NUMBERS = [9, 10, 13, 15, 19, 24];

export function VideosForYouCarousel() {
  const theme = useTheme();
  const [episodes, setEpisodes] = useState<GuideEpisode[] | null>(null);
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    GuideService.getGuide()
      .then((guide) => {
        if (cancelled) return;
        const featured = (guide.episodes ?? []).filter((episode) =>
          FEATURED_EPISODE_NUMBERS.includes(episode.number),
        );
        setEpisodes(featured);
        setPlaylistId(guide.playlistId);
        setFallbackUrl(guide.playlistUrl ?? guide.watchUrl);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load videos right now.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleWatch(episode: GuideEpisode) {
    const url = episode.videoId
      ? `https://www.youtube.com/watch?v=${episode.videoId}${playlistId ? `&list=${playlistId}` : ''}`
      : fallbackUrl;
    if (url) Linking.openURL(url);
  }

  if (error || episodes?.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Videos For You
        </ThemedText>
        <ThemedText type="small" themeColor="outline">
          {episodes?.length ? `${episodes.length} videos — ` : ''}From the After School series
          {episodes && episodes.length > 1 ? ' • swipe for more' : ''}
        </ThemedText>
      </View>

      {episodes === null ? (
        <ActivityIndicator color={theme.primary} style={styles.loading} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContent}>
          {episodes.map((episode) => (
            <Pressable
              key={episode.number}
              onPress={() => handleWatch(episode)}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder },
                pressed && styles.pressed,
              ]}>
              <View style={[styles.thumbnail, { backgroundColor: theme.surfaceContainer }]}>
                {episode.thumbnailUrl && (
                  <Image source={{ uri: episode.thumbnailUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
                )}
                <View style={[StyleSheet.absoluteFill, styles.playOverlay]}>
                  <MaterialIcons name="play-circle-filled" size={36} color="#ffffff" />
                </View>
                <View style={[styles.episodeBadge, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
                  <ThemedText type="small" style={styles.episodeBadgeLabel}>
                    Ep {episode.number}
                  </ThemedText>
                </View>
              </View>
              <ThemedText type="smallBold" numberOfLines={2} style={styles.title}>
                {episode.title ?? 'Untitled episode'}
              </ThemedText>
              {episode.duration && (
                <View style={styles.durationRow}>
                  <MaterialIcons name="schedule" size={13} color={theme.onSurfaceVariant} />
                  <ThemedText type="small" themeColor="onSurfaceVariant">
                    {episode.duration}
                  </ThemedText>
                </View>
              )}
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.one,
  },
  sectionHeader: {
    gap: 2,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  carouselContent: {
    gap: Spacing.two,
    paddingVertical: Spacing.half,
  },
  loading: {
    paddingVertical: Spacing.five,
  },
  card: {
    width: 150,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  thumbnail: {
    height: 96,
    borderRadius: Radius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  episodeBadge: {
    position: 'absolute',
    top: Spacing.one,
    left: Spacing.one,
    paddingHorizontal: Spacing.one,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  episodeBadgeLabel: {
    color: '#ffffff',
  },
  title: {
    fontSize: 13,
    lineHeight: 17,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pressed: {
    opacity: 0.85,
  },
});
