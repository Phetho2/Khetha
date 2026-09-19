import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { RIASEC_META } from '@/data/assessment-questions';
import { Career } from '@/data/careers';
import { useTheme } from '@/hooks/use-theme';

type CareerListRowProps = {
  career: Career;
  isSaved: boolean;
  onToggleSave: () => Promise<void>;
  onPress: () => void;
};

export function CareerListRow({ career, isSaved, onToggleSave, onPress }: CareerListRowProps) {
  const theme = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  function handleToggleSave() {
    setIsSaving(true);
    onToggleSave().finally(() => setIsSaving(false));
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder },
        pressed && styles.pressed,
      ]}>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <ThemedText type="smallBold" numberOfLines={1} style={styles.title}>
            {career.title ?? 'Untitled Career'}
          </ThemedText>
          {career.riasecTags && career.riasecTags.length > 0 && (
            <View style={styles.traitRow}>
              {career.riasecTags.slice(0, 3).map((tag) => {
                const meta = RIASEC_META[tag];
                if (!meta) return null;
                return (
                  <View key={tag} style={[styles.traitDot, { backgroundColor: meta.color }]}>
                    <MaterialIcons name={meta.icon as never} size={10} color="#fff" />
                  </View>
                );
              })}
            </View>
          )}
        </View>
        {career.summary && (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
            {career.summary}
          </ThemedText>
        )}
        {career.ofoCode && (
          <ThemedText type="small" themeColor="outline">
            OFO {career.ofoCode}
          </ThemedText>
        )}
      </View>

      <Pressable
        accessibilityLabel={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
        onPress={handleToggleSave}
        disabled={isSaving}
        hitSlop={8}
        style={styles.bookmarkButton}>
        {isSaving ? (
          <ActivityIndicator size="small" color={theme.onSurfaceVariant} />
        ) : (
          <MaterialIcons
            name={isSaved ? 'bookmark' : 'bookmark-border'}
            size={20}
            color={isSaved ? theme.primary : theme.onSurfaceVariant}
          />
        )}
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.two,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.one,
  },
  title: {
    flexShrink: 1,
  },
  traitRow: {
    flexDirection: 'row',
    gap: 4,
  },
  traitDot: {
    width: 18,
    height: 18,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
