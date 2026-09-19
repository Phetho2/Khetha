import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { CourseDetailInfo, CourseDetailModal } from '@/components/ncap/course-detail-modal';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { Career } from '@/data/careers';
import { CareersUnlockedResult, UnlockedCourse } from '@/data/subjects';
import { useTheme } from '@/hooks/use-theme';
import { CareersService } from '@/services/careers-service';
import { UniversitiesService } from '@/services/universities-service';

type UnlockedCareersPanelProps = {
  result: CareersUnlockedResult;
  learnerAps: number | null;
};

export function UnlockedCareersPanel({ result, learnerAps }: UnlockedCareersPanelProps) {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [expandedFaculties, setExpandedFaculties] = useState<Set<string>>(new Set());
  const [courseDetails, setCourseDetails] = useState<Map<number, CourseDetailInfo>>(new Map());
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);

  const allFaculties = useMemo(() => result.facultiesUnlocked ?? [], [result.facultiesUnlocked]);
  const trimmedQuery = query.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  const universities = useMemo(() => {
    const names = new Set<string>();
    for (const group of allFaculties) {
      for (const course of group.courses ?? []) {
        if (course.university) names.add(course.university);
      }
    }
    return Array.from(names).sort();
  }, [allFaculties]);

  const faculties = useMemo(() => {
    if (!selectedUniversity) return allFaculties;
    return allFaculties
      .map((group) => ({
        ...group,
        courses: (group.courses ?? []).filter((course) => course.university === selectedUniversity),
      }))
      .filter((group) => (group.courses?.length ?? 0) > 0);
  }, [allFaculties, selectedUniversity]);

  const totalCourses = faculties.reduce((sum, group) => sum + (group.courses?.length ?? 0), 0);

  useEffect(() => {
    if (allFaculties.length === 0) return;
    Promise.all([UniversitiesService.getUniversities(), CareersService.getCareers()])
      .then(([universityCatalog, careerList]) => {
        const details = new Map<number, CourseDetailInfo>();
        for (const university of universityCatalog) {
          const websiteLink = university.prospectusUrl || university.website || undefined;
          for (const course of university.courses ?? []) {
            details.set(course.id, {
              course,
              universityName: university.name ?? '',
              websiteLink,
            });
          }
        }
        setCourseDetails(details);
        setCareers(careerList);
      })
      .catch(() => {
        // Best-effort — "More Info" just won't have anything to show if this fails.
      });
  }, [allFaculties]);

  const searchResults = isSearching
    ? faculties.flatMap((group) =>
        (group.courses ?? [])
          .filter(
            (course) =>
              (course.courseName ?? '').toLowerCase().includes(trimmedQuery) ||
              (course.university ?? '').toLowerCase().includes(trimmedQuery),
          )
          .map((course) => ({ course, faculty: group.faculty })),
      )
    : [];

  function toggleFaculty(faculty: string) {
    setExpandedFaculties((current) => {
      const next = new Set(current);
      if (next.has(faculty)) {
        next.delete(faculty);
      } else {
        next.add(faculty);
      }
      return next;
    });
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder }]}>
      <View style={styles.headerColumn}>
        <ThemedText type="smallBold" themeColor="primary">
          Careers Unlocked By Your Subjects
        </ThemedText>
        {allFaculties.length > 0 && (
          <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.headerMeta} numberOfLines={1}>
            {totalCourses} course{totalCourses === 1 ? '' : 's'} · {faculties.length} field
            {faculties.length === 1 ? '' : 's'}
            {selectedUniversity ? ` at ${selectedUniversity}` : ''}
          </ThemedText>
        )}
      </View>

      {allFaculties.length === 0 ? (
        <ThemedText type="small" themeColor="onSurfaceVariant">
          No matching courses found for this subject combination yet.
        </ThemedText>
      ) : (
        <>
          <View style={[styles.searchBox, { backgroundColor: theme.surfaceContainerLow }]}>
            <MaterialIcons name="search" size={18} color={theme.onSurfaceVariant} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search a career or course..."
              placeholderTextColor={theme.onSurfaceVariant}
              style={[styles.searchInput, { color: theme.onSurface }]}
            />
            {query.length > 0 && (
              <Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')}>
                <MaterialIcons name="close" size={16} color={theme.onSurfaceVariant} />
              </Pressable>
            )}
          </View>

          {universities.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.universityFilterRow}>
              <Pressable
                onPress={() => setSelectedUniversity(null)}
                style={[
                  styles.universityChip,
                  {
                    backgroundColor: !selectedUniversity ? theme.primary : theme.surfaceContainerLow,
                  },
                ]}>
                <ThemedText
                  type="small"
                  style={styles.universityChipLabel}
                  themeColor={!selectedUniversity ? 'onPrimary' : 'onSurfaceVariant'}>
                  All Universities
                </ThemedText>
              </Pressable>
              {universities.map((university) => {
                const selected = selectedUniversity === university;
                return (
                  <Pressable
                    key={university}
                    onPress={() => setSelectedUniversity(selected ? null : university)}
                    style={[
                      styles.universityChip,
                      { backgroundColor: selected ? theme.primary : theme.surfaceContainerLow },
                    ]}>
                    <ThemedText
                      type="small"
                      style={styles.universityChipLabel}
                      themeColor={selected ? 'onPrimary' : 'onSurfaceVariant'}>
                      {university}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {isSearching ? (
            searchResults.length === 0 ? (
              <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.centeredText}>
                No courses match &quot;{query}&quot;.
              </ThemedText>
            ) : (
              <View style={styles.list}>
                {searchResults.map(({ course, faculty }) => (
                  <CourseRow
                    key={course.courseId}
                    course={course}
                    faculty={faculty}
                    hasDetail={courseDetails.has(course.courseId)}
                    requiredAps={courseDetails.get(course.courseId)?.course.totalAPS}
                    learnerAps={learnerAps}
                    onMoreInfo={() => setSelectedCourseId(course.courseId)}
                    theme={theme}
                  />
                ))}
              </View>
            )
          ) : faculties.length === 0 ? (
            <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.centeredText}>
              No unlocked courses at {selectedUniversity} for this subject combination.
            </ThemedText>
          ) : (
            <View style={styles.list}>
              {faculties.map((group) => {
                const faculty = group.faculty ?? '';
                const expanded = expandedFaculties.has(faculty);
                const courseCount = group.courses?.length ?? 0;
                return (
                  <View key={faculty} style={[styles.facultyCard, { backgroundColor: theme.surfaceContainerLow }]}>
                    <Pressable onPress={() => toggleFaculty(faculty)} style={styles.facultyHeader}>
                      <View style={styles.facultyTitleColumn}>
                        <ThemedText type="smallBold" numberOfLines={2}>
                          {group.faculty}
                        </ThemedText>
                        <ThemedText type="small" themeColor="onSurfaceVariant">
                          {courseCount} course{courseCount === 1 ? '' : 's'}
                        </ThemedText>
                      </View>
                      <MaterialIcons
                        name={expanded ? 'expand-less' : 'expand-more'}
                        size={22}
                        color={theme.onSurfaceVariant}
                      />
                    </Pressable>
                    {expanded && (
                      <Animated.View entering={FadeIn.duration(150)} style={styles.courseList}>
                        {group.courses?.map((course) => (
                          <CourseRow
                            key={course.courseId}
                            course={course}
                            hasDetail={courseDetails.has(course.courseId)}
                            requiredAps={courseDetails.get(course.courseId)?.course.totalAPS}
                            learnerAps={learnerAps}
                            onMoreInfo={() => setSelectedCourseId(course.courseId)}
                            theme={theme}
                          />
                        ))}
                      </Animated.View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </>
      )}

      {result.notes && (
        <ThemedText type="small" themeColor="outline" style={styles.centeredText}>
          {result.notes}
        </ThemedText>
      )}

      <CourseDetailModal
        detail={selectedCourseId !== null ? (courseDetails.get(selectedCourseId) ?? null) : null}
        careers={careers}
        onClose={() => setSelectedCourseId(null)}
      />
    </View>
  );
}

function CourseRow({
  course,
  faculty,
  hasDetail,
  requiredAps,
  learnerAps,
  onMoreInfo,
  theme,
}: {
  course: UnlockedCourse;
  faculty?: string | null;
  hasDetail: boolean;
  requiredAps?: number;
  learnerAps: number | null;
  onMoreInfo: () => void;
  theme: ReturnType<typeof useTheme>;
}) {
  const qualifies = requiredAps !== undefined && learnerAps !== null && learnerAps >= requiredAps;

  return (
    <View
      style={[
        styles.courseItem,
        { backgroundColor: qualifies ? theme.primaryContainer : theme.surfaceContainerLowest },
        qualifies && { borderColor: theme.primary, borderWidth: 1 },
      ]}>
      {qualifies && (
        <View style={styles.qualifiesRow}>
          <MaterialIcons name="check-circle" size={13} color={theme.onPrimaryContainer} />
          <ThemedText type="small" style={[styles.qualifiesLabel, { color: theme.onPrimaryContainer }]}>
            You qualify — APS {requiredAps}+
          </ThemedText>
        </View>
      )}
      <ThemedText
        type="small"
        style={styles.courseName}
        themeColor={qualifies ? 'onPrimaryContainer' : undefined}
        numberOfLines={2}>
        {course.courseName}
      </ThemedText>
      <ThemedText type="small" themeColor={qualifies ? 'onPrimaryContainer' : 'onSurfaceVariant'} numberOfLines={1}>
        {course.university}
      </ThemedText>
      {faculty && (
        <ThemedText type="small" themeColor={qualifies ? 'onPrimaryContainer' : 'outline'} numberOfLines={1}>
          {faculty}
        </ThemedText>
      )}
      {hasDetail && (
        <Pressable onPress={onMoreInfo} style={styles.moreInfoRow}>
          <ThemedText
            type="small"
            themeColor={qualifies ? 'onPrimaryContainer' : 'primary'}
            style={styles.moreInfoLabel}>
            More Info
          </ThemedText>
          <MaterialIcons
            name="chevron-right"
            size={16}
            color={qualifies ? theme.onPrimaryContainer : theme.primary}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  headerColumn: {
    gap: 2,
  },
  headerMeta: {
    marginTop: 1,
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
  universityFilterRow: {
    flexDirection: 'row',
    gap: Spacing.one,
    paddingVertical: 2,
  },
  universityChip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
  },
  universityChipLabel: {
    fontWeight: '600',
  },
  centeredText: {
    textAlign: 'center',
  },
  list: {
    gap: Spacing.one,
  },
  facultyCard: {
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  facultyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    padding: Spacing.two,
  },
  facultyTitleColumn: {
    flex: 1,
    gap: 2,
  },
  courseList: {
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingBottom: Spacing.two,
  },
  courseItem: {
    padding: Spacing.two,
    borderRadius: Radius.sm,
    gap: 2,
  },
  courseName: {
    fontWeight: '600',
  },
  qualifiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  qualifiesLabel: {
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.2,
  },
  moreInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  moreInfoLabel: {
    fontWeight: '600',
  },
});
