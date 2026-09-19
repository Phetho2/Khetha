import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { RIASEC_META } from '@/data/assessment-questions';
import { MatchedCareer } from '@/data/careers';
import { useTheme } from '@/hooks/use-theme';

import { Badge } from './badge';

type CareerCardProps = {
  career: MatchedCareer;
  onExplore: () => void;
  isSaved: boolean;
  onToggleSave: () => Promise<void>;
};

export function CareerCard({ career, onExplore, isSaved, onToggleSave }: CareerCardProps) {
  const theme = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const matchPercent = Math.round((career.overallScore ?? 0) * 100);

  function handleToggleSave() {
    setIsSaving(true);
    onToggleSave().finally(() => setIsSaving(false));
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder }]}>
      <View style={styles.headerRow}>
        <Badge
          label={`${matchPercent}% Match`}
          backgroundColor={theme.primary}
          textColor={theme.onPrimary}
          icon={<MaterialIcons name="verified" size={13} color={theme.onPrimary} />}
        />
        <View style={styles.rightGroup}>
          {career.riasecTags && career.riasecTags.length > 0 && (
            <View style={styles.traitRow}>
              {career.riasecTags.slice(0, 3).map((tag) => {
                const meta = RIASEC_META[tag];
                if (!meta) return null;
                return (
                  <View key={tag} style={[styles.traitDot, { backgroundColor: meta.color }]}>
                    <MaterialIcons name={meta.icon as never} size={11} color="#fff" />
                  </View>
                );
              })}
            </View>
          )}
          <Pressable
            accessibilityLabel={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
            onPress={handleToggleSave}
            disabled={isSaving}
            hitSlop={6}
            style={({ pressed }) => [
              styles.bookmarkButton,
              { backgroundColor: theme.surfaceContainerHigh },
              pressed && styles.pressed,
            ]}>
            {isSaving ? (
              <ActivityIndicator size="small" color={theme.onSurfaceVariant} />
            ) : (
              <MaterialIcons
                name={isSaved ? 'bookmark' : 'bookmark-border'}
                size={16}
                color={isSaved ? theme.primary : theme.onSurfaceVariant}
              />
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.details}>
        <ThemedText type="smallBold" style={styles.title} numberOfLines={2}>
          {career.title ?? 'Untitled Career'}
        </ThemedText>
        {career.summary && (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={3}>
            {career.summary}
          </ThemedText>
        )}
      </View>

      <View style={styles.footer}>
        {career.ofoCode ? (
          <ThemedText type="small" themeColor="outline">
            OFO {career.ofoCode}
          </ThemedText>
        ) : (
          <View />
        )}
        <Pressable
          onPress={onExplore}
          style={({ pressed }) => [
            styles.exploreButton,
            { backgroundColor: theme.surfaceContainerHigh },
            pressed && styles.pressed,
          ]}>
          <ThemedText type="smallBold" themeColor="primary">
            Explore
          </ThemedText>
          <MaterialIcons name="chevron-right" size={16} color={theme.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  traitRow: {
    flexDirection: 'row',
    gap: 4,
  },
  traitDot: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkButton: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    gap: 2,
    minHeight: 78,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    gap: 2,
  },
  pressed: {
    opacity: 0.85,
  },
});
