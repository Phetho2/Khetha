import { MaterialIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { Subject } from '@/data/subjects';
import { useTheme } from '@/hooks/use-theme';

type AddSubjectPickerProps = {
  catalog: Subject[];
  selectedNames: Set<string>;
  onToggle: (name: string) => void;
};

function groupByCategory(subjects: Subject[]): [string, Subject[]][] {
  const groups = new Map<string, Subject[]>();
  for (const subject of subjects) {
    const list = groups.get(subject.category) ?? [];
    list.push(subject);
    groups.set(subject.category, list);
  }
  return Array.from(groups.entries());
}

export function AddSubjectPicker({ catalog, selectedNames, onToggle }: AddSubjectPickerProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

  const trimmedQuery = query.trim().toLowerCase();
  const filtered = trimmedQuery ? catalog.filter((subject) => subject.name.toLowerCase().includes(trimmedQuery)) : catalog;
  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  function close() {
    setVisible(false);
    setQuery('');
  }

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={[styles.trigger, { backgroundColor: theme.surfaceContainerLow, borderColor: theme.cardBorder }]}>
        <MaterialIcons name="search" size={18} color={theme.onSurfaceVariant} />
        <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.triggerLabel}>
          Search subjects to add...
        </ThemedText>
        {selectedNames.size > 0 && (
          <View style={[styles.countBadge, { backgroundColor: theme.primary }]}>
            <ThemedText type="small" style={{ color: theme.onPrimary }}>
              {selectedNames.size}
            </ThemedText>
          </View>
        )}
      </Pressable>

      <Modal visible={visible} animationType="slide" transparent onRequestClose={close}>
        <View style={styles.backdrop}>
          <Pressable style={styles.backdropPress} onPress={close} />
          <View style={[styles.sheet, { backgroundColor: theme.surfaceContainerLowest }]}>
            <View style={styles.grabberRow}>
              <View style={[styles.grabber, { backgroundColor: theme.surfaceContainerHigh }]} />
            </View>

            <View style={styles.sheetHeader}>
              <View style={[styles.searchBox, { backgroundColor: theme.surfaceContainerLow }]}>
                <MaterialIcons name="search" size={18} color={theme.onSurfaceVariant} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  autoFocus
                  placeholder="Search subjects..."
                  placeholderTextColor={theme.onSurfaceVariant}
                  style={[styles.searchInput, { color: theme.onSurface }]}
                />
                {query.length > 0 && (
                  <Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')}>
                    <MaterialIcons name="close" size={16} color={theme.onSurfaceVariant} />
                  </Pressable>
                )}
              </View>
              <Pressable onPress={close} style={styles.doneButton}>
                <ThemedText type="smallBold" themeColor="primary">
                  Done
                </ThemedText>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
              {grouped.length === 0 ? (
                <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.emptyText}>
                  No subjects match &quot;{query}&quot;.
                </ThemedText>
              ) : (
                grouped.map(([category, items]) => (
                  <View key={category} style={styles.categoryGroup}>
                    <ThemedText type="small" themeColor="outline">
                      {category}
                    </ThemedText>
                    {items.map((subject) => {
                      const selected = selectedNames.has(subject.name);
                      return (
                        <Pressable
                          key={subject.id}
                          onPress={() => onToggle(subject.name)}
                          style={[
                            styles.subjectRow,
                            { backgroundColor: selected ? theme.surfaceContainerHigh : theme.surfaceContainerLow },
                          ]}>
                          <ThemedText type="small" style={styles.subjectName}>
                            {subject.name}
                          </ThemedText>
                          <MaterialIcons
                            name={selected ? 'check-circle' : 'radio-button-unchecked'}
                            size={20}
                            color={selected ? theme.primary : theme.onSurfaceVariant}
                          />
                        </Pressable>
                      );
                    })}
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    height: 48,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  triggerLabel: {
    flex: 1,
  },
  countBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backdropPress: {
    flex: 1,
  },
  sheet: {
    maxHeight: '85%',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  grabberRow: {
    alignItems: 'center',
    paddingTop: Spacing.two,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  searchBox: {
    flex: 1,
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
  doneButton: {
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.two,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.three,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: Spacing.four,
  },
  categoryGroup: {
    gap: Spacing.one,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
  },
  subjectName: {
    flex: 1,
  },
});
