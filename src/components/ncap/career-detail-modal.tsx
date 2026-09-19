import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { RIASEC_META } from '@/data/assessment-questions';
import { MatchedCareer } from '@/data/careers';
import { useTheme } from '@/hooks/use-theme';

type CareerDetailModalProps = {
  career: MatchedCareer | null;
  onClose: () => void;
  // The caller owns saved state (it needs it for its own card/list rendering
  // too), so the modal is controlled rather than fetching its own copy.
  isSaved: boolean;
  onToggleSave: () => Promise<void>;
};

export function CareerDetailModal({ career, onClose, isSaved, onToggleSave }: CareerDetailModalProps) {
  const theme = useTheme();
  const { learner } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const matchPercent = career?.overallScore !== undefined ? Math.round(career.overallScore * 100) : null;

  function handleToggleSave() {
    setIsSaving(true);
    onToggleSave().finally(() => setIsSaving(false));
  }

  return (
    <Modal visible={career !== null} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: theme.surfaceContainerLowest }]}>
          <View style={styles.grabberRow}>
            <View style={[styles.grabber, { backgroundColor: theme.surfaceContainerHigh }]} />
          </View>

          {career && (
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                {matchPercent !== null && (
                  <View style={[styles.matchPill, { backgroundColor: theme.primary }]}>
                    <MaterialIcons name="verified" size={13} color={theme.onPrimary} />
                    <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
                      {matchPercent}% Match
                    </ThemedText>
                  </View>
                )}
                <ThemedText type="subtitle" style={styles.careerTitle}>
                  {career.title ?? 'Untitled Career'}
                </ThemedText>
                {career.ofoCode && (
                  <ThemedText type="small" themeColor="onSurfaceVariant">
                    OFO {career.ofoCode}
                  </ThemedText>
                )}
              </View>

              <Pressable
                onPress={handleToggleSave}
                disabled={isSaving}
                style={({ pressed }) => [
                  styles.saveButton,
                  { backgroundColor: isSaved ? theme.secondaryContainer : theme.surfaceContainer },
                  pressed && styles.pressed,
                ]}>
                {isSaving ? (
                  <ActivityIndicator size="small" color={theme.onSurfaceVariant} />
                ) : (
                  <MaterialIcons
                    name={isSaved ? 'bookmark' : 'bookmark-border'}
                    size={18}
                    color={isSaved ? theme.onSecondaryContainer : theme.onSurfaceVariant}
                  />
                )}
                <ThemedText type="smallBold" themeColor={isSaved ? 'onSecondaryContainer' : 'onSurfaceVariant'}>
                  {!learner
                    ? 'Sign in to save'
                    : isSaved
                      ? 'Saved to Shortlist'
                      : 'Save to Shortlist'}
                </ThemedText>
              </Pressable>

              {career.summary && (
                <View style={styles.section}>
                  <ThemedText type="smallBold" themeColor="primary">
                    About This Career
                  </ThemedText>
                  <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.bodyText}>
                    {career.summary}
                  </ThemedText>
                </View>
              )}

              {career.responsibilities && career.responsibilities.length > 0 && (
                <View style={styles.section}>
                  <ThemedText type="smallBold" themeColor="primary">
                    What You&apos;d Do
                  </ThemedText>
                  <View style={styles.list}>
                    {career.responsibilities.map((item) => (
                      <ThemedText key={item} type="small" themeColor="onSurfaceVariant">
                        • {item}
                      </ThemedText>
                    ))}
                  </View>
                </View>
              )}

              {career.requiredSubjects && career.requiredSubjects.length > 0 && (
                <View style={styles.section}>
                  <ThemedText type="smallBold" themeColor="primary">
                    Subject Requirements
                  </ThemedText>
                  <View style={[styles.requirementsCard, { backgroundColor: theme.surfaceContainerLow }]}>
                    {career.requiredSubjects.map((req) => (
                      <View key={req.subject} style={styles.requirementRow}>
                        <ThemedText type="small">{req.subject}</ThemedText>
                        <ThemedText type="smallBold" themeColor="onSurfaceVariant">
                          {req.level}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {career.riasecTags && career.riasecTags.length > 0 && (
                <View style={styles.section}>
                  <ThemedText type="smallBold" themeColor="primary">
                    Suits These Interests
                  </ThemedText>
                  <View style={styles.traitList}>
                    {career.riasecTags.map((tag) => {
                      const meta = RIASEC_META[tag];
                      if (!meta) return null;
                      return (
                        <View key={tag} style={[styles.traitPill, { backgroundColor: theme.surfaceContainerLow }]}>
                          <View style={[styles.traitDot, { backgroundColor: meta.color }]}>
                            <MaterialIcons name={meta.icon as never} size={12} color="#fff" />
                          </View>
                          <ThemedText type="small">{meta.label}</ThemedText>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {career.pathways && career.pathways.length > 0 && (
                <View style={styles.section}>
                  <ThemedText type="smallBold" themeColor="primary">
                    Study Pathways
                  </ThemedText>
                  <View style={styles.list}>
                    {career.pathways.map((item) => (
                      <ThemedText key={item} type="small" themeColor="onSurfaceVariant">
                        • {item}
                      </ThemedText>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          )}

          <Pressable
            accessibilityLabel="Close"
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, { backgroundColor: theme.surfaceContainer }, pressed && styles.pressed]}>
            <MaterialIcons name="close" size={20} color={theme.onSurface} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: Spacing.four,
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
  closeButton: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.one,
    paddingRight: Spacing.five,
  },
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.full,
  },
  careerTitle: {
    fontSize: 19,
    lineHeight: 25,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    height: 44,
    borderRadius: Radius.lg,
    marginBottom: Spacing.one,
  },
  section: {
    gap: Spacing.two,
  },
  bodyText: {
    lineHeight: 19,
  },
  list: {
    gap: 4,
  },
  requirementsCard: {
    borderRadius: Radius.md,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  requirementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  traitList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  traitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
  },
  traitDot: {
    width: 18,
    height: 18,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
