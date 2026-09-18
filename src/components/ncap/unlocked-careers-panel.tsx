import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
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
};

export function UnlockedCareersPanel({ result }: UnlockedCareersPanelProps) {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [expandedFaculties, setExpandedFaculties] = useState<Set<string>>(new Set());
  const [courseDetails, setCourseDetails] = useState<Map<number, CourseDetailInfo>>(new Map());
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const faculties = result.facultiesUnlocked ?? [];
  const totalCourses = faculties.reduce((sum, group) => sum + (group.courses?.length ?? 0), 0);
  const trimmedQuery = query.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  useEffect(() => {
    if ((result.facultiesUnlocked?.length ?? 0) === 0) return;
    Promise.all([UniversitiesService.getUniversities(), CareersService.getCareers()])
      .then(([universities, careerList]) => {
        const details = new Map<number, CourseDetailInfo>();
        for (const university of universities) {
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
  }, [result]);

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
      <View style={styles.headerRow}>
        <ThemedText type="smallBold" themeColor="primary">
          Careers Unlocked By Your Subjects
        </ThemedText>
        {faculties.length > 0 && (
          <ThemedText type="small" themeColor="onSurfaceVariant">
            {totalCourses} course{totalCourses === 1 ? '' : 's'} · {faculties.length} field
            {faculties.length === 1 ? '' : 's'}
          </ThemedText>
        )}
      </View>

      {faculties.length === 0 ? (
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
                    onMoreInfo={() => setSelectedCourseId(course.courseId)}
                    theme={theme}
                  />
                ))}
              </View>
            )
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
  onMoreInfo,
  theme,
}: {
  course: UnlockedCourse;
  faculty?: string | null;
  hasDetail: boolean;
  onMoreInfo: () => void;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={[styles.courseItem, { backgroundColor: theme.surfaceContainerLowest }]}>
      <ThemedText type="small" style={styles.courseName} numberOfLines={2}>
        {course.courseName}
      </ThemedText>
      <ThemedText type="small" themeColor="onSurfaceVariant" numberOfLines={1}>
        {course.university}
      </ThemedText>
      {faculty && (
        <ThemedText type="small" themeColor="outline" numberOfLines={1}>
          {faculty}
        </ThemedText>
      )}
      {hasDetail && (
        <Pressable onPress={onMoreInfo} style={styles.moreInfoRow}>
          <ThemedText type="small" themeColor="primary" style={styles.moreInfoLabel}>
            More Info
          </ThemedText>
          <MaterialIcons name="chevron-right" size={16} color={theme.primary} />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
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
  centeredText: {
    textAlign: 'center',
    lineHeight: 18,
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
  moreInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  moreInfoLabel: {
    fontWeight: '600',
  },
});
