import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Linking, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { Career } from '@/data/careers';
import { Course } from '@/data/universities';
import { useTheme } from '@/hooks/use-theme';
import { matchCareersToCourse } from '@/utils/match-careers-to-course';

export type CourseDetailInfo = {
  course: Course;
  universityName: string;
  websiteLink?: string;
};

type CourseDetailModalProps = {
  detail: CourseDetailInfo | null;
  careers: Career[];
  onClose: () => void;
};

export function CourseDetailModal({ detail, careers, onClose }: CourseDetailModalProps) {
  const theme = useTheme();

  const relatedCareers = useMemo(() => {
    if (!detail?.course.name) return [];
    return matchCareersToCourse(detail.course.name, careers);
  }, [detail, careers]);

  return (
    <Modal visible={detail !== null} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: theme.surfaceContainerLowest }]}>
          <View style={styles.grabberRow}>
            <View style={[styles.grabber, { backgroundColor: theme.surfaceContainerHigh }]} />
          </View>

          {detail && (
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <ThemedText type="subtitle" style={styles.courseName}>
                  {detail.course.name}
                </ThemedText>
                <ThemedText type="small" themeColor="onSurfaceVariant">
                  {detail.universityName}
                  {detail.course.campus ? ` · ${detail.course.campus}` : ''}
                </ThemedText>
              </View>

              <View style={styles.metaRow}>
                {detail.course.qualificationCode && (
                  <MetaPill label={detail.course.qualificationCode} theme={theme} />
                )}
                {detail.course.duration && <MetaPill label={detail.course.duration} theme={theme} />}
                {detail.course.totalAPS > 0 && <MetaPill label={`APS ${detail.course.totalAPS}+`} theme={theme} />}
              </View>

              {detail.course.subjectRequirements && detail.course.subjectRequirements.length > 0 && (
                <View style={styles.section}>
                  <ThemedText type="smallBold" themeColor="primary">
                    Subject Requirements
                  </ThemedText>
                  <View style={[styles.requirementsCard, { backgroundColor: theme.surfaceContainerLow }]}>
                    {detail.course.subjectRequirements.map((req) => (
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

              {detail.course.notes && (
                <View style={styles.section}>
                  <ThemedText type="smallBold" themeColor="primary">
                    Admission Notes
                  </ThemedText>
                  <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.notesText}>
                    {detail.course.notes}
                  </ThemedText>
                </View>
              )}

              <View style={styles.section}>
                <ThemedText type="smallBold" themeColor="primary">
                  Jobs You Could Work After Finishing
                </ThemedText>
                {relatedCareers.length === 0 ? (
                  <ThemedText type="small" themeColor="onSurfaceVariant">
                    No specific career listings match this qualification in our directory yet.
                  </ThemedText>
                ) : (
                  <View style={styles.careersList}>
                    {relatedCareers.map((career) => (
                      <View key={career.id} style={[styles.careerCard, { backgroundColor: theme.surfaceContainerLow }]}>
                        <ThemedText type="smallBold">{career.title}</ThemedText>
                        {career.summary && (
                          <ThemedText type="small" themeColor="onSurfaceVariant">
                            {career.summary}
                          </ThemedText>
                        )}
                        {career.responsibilities && career.responsibilities.length > 0 && (
                          <View style={styles.responsibilityList}>
                            {career.responsibilities.map((item) => (
                              <ThemedText key={item} type="small" themeColor="onSurfaceVariant">
                                • {item}
                              </ThemedText>
                            ))}
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {detail.websiteLink && (
                <Pressable
                  onPress={() => Linking.openURL(detail.websiteLink!)}
                  style={({ pressed }) => [
                    styles.websiteButton,
                    { backgroundColor: theme.surfaceContainer },
                    pressed && styles.pressed,
                  ]}>
                  <ThemedText type="smallBold" themeColor="primary">
                    Visit {detail.universityName} Website
                  </ThemedText>
                  <MaterialIcons name="open-in-new" size={16} color={theme.primary} />
                </Pressable>
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

function MetaPill({ label, theme }: { label: string; theme: ReturnType<typeof useTheme> }) {
  return (
    <View style={[styles.metaPill, { backgroundColor: theme.surfaceContainer }]}>
      <ThemedText type="small" themeColor="onSurfaceVariant">
        {label}
      </ThemedText>
    </View>
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
    gap: 4,
    paddingRight: Spacing.five,
  },
  courseName: {
    fontSize: 19,
    lineHeight: 25,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  metaPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
  },
  section: {
    gap: Spacing.two,
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
  notesText: {
    lineHeight: 19,
  },
  careersList: {
    gap: Spacing.one,
  },
  careerCard: {
    borderRadius: Radius.md,
    padding: Spacing.two,
    gap: 4,
  },
  responsibilityList: {
    marginTop: 2,
    gap: 2,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    height: 48,
    borderRadius: Radius.lg,
  },
  pressed: {
    opacity: 0.85,
  },
});
