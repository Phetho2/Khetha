import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { ApsCalculationResult, CareersUnlockedResult, LearnerSubjectScore, Subject } from '@/data/subjects';
import { useTheme } from '@/hooks/use-theme';
import { ApiError } from '@/services/api-client';
import { SchoolStatus, SubjectPlanStorage } from '@/services/subject-plan-storage';
import { SubjectsService } from '@/services/subjects-service';

import { AddSubjectPicker } from './add-subject-picker';
import { ScreenLoading } from './screen-loading';
import { SubjectLevelRow } from './subject-level-row';
import { UnlockedCareersPanel } from './unlocked-careers-panel';

const DEFAULT_LEVEL = 4;

const SCHOOL_STATUS_OPTIONS: { value: SchoolStatus; label: string }[] = [
  { value: 'in-school', label: 'Still in School' },
  { value: 'finished', label: 'Finished School' },
];

type SubjectPlannerProps = {
  onContinue?: () => void;
  continueLabel?: string;
};

export function SubjectPlanner({ onContinue, continueLabel = 'Continue' }: SubjectPlannerProps) {
  const theme = useTheme();
  const [catalog, setCatalog] = useState<Subject[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mySubjects, setMySubjects] = useState<LearnerSubjectScore[]>([]);
  const [schoolStatus, setSchoolStatus] = useState<SchoolStatus | null>(null);
  const [hasLoadedPlan, setHasLoadedPlan] = useState(false);
  const [apsResult, setApsResult] = useState<ApsCalculationResult | null>(null);
  const [unlockedResult, setUnlockedResult] = useState<CareersUnlockedResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculateError, setCalculateError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([SubjectsService.getSubjects(), SubjectPlanStorage.getSubjects(), SubjectPlanStorage.getSchoolStatus()])
      .then(([subjects, savedSubjects, savedStatus]) => {
        if (cancelled) return;
        setCatalog(subjects);
        setMySubjects(savedSubjects);
        setSchoolStatus(savedStatus);
        setHasLoadedPlan(true);
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(error instanceof ApiError ? error.message : 'Could not load subjects.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedPlan) return;
    SubjectPlanStorage.setSubjects(mySubjects);
  }, [hasLoadedPlan, mySubjects]);

  function selectSchoolStatus(status: SchoolStatus) {
    setSchoolStatus(status);
    SubjectPlanStorage.setSchoolStatus(status);
  }

  function toggleSubject(name: string) {
    setApsResult(null);
    setUnlockedResult(null);
    setMySubjects((current) => {
      if (current.some((entry) => entry.subject === name)) {
        return current.filter((entry) => entry.subject !== name);
      }
      return [...current, { subject: name, level: DEFAULT_LEVEL }];
    });
  }

  function changeLevel(name: string, level: number) {
    setApsResult(null);
    setUnlockedResult(null);
    setMySubjects((current) => current.map((entry) => (entry.subject === name ? { ...entry, level } : entry)));
  }

  function removeSubject(name: string) {
    setApsResult(null);
    setUnlockedResult(null);
    setMySubjects((current) => current.filter((entry) => entry.subject !== name));
  }

  function calculate() {
    setIsCalculating(true);
    setCalculateError(null);
    Promise.all([
      SubjectsService.calculateAps(mySubjects),
      SubjectsService.getCareersUnlocked(mySubjects.map((entry) => entry.subject)),
    ])
      .then(([aps, unlocked]) => {
        setApsResult(aps);
        setUnlockedResult(unlocked);
      })
      .catch((error: unknown) => {
        setCalculateError(error instanceof ApiError ? error.message : 'Could not calculate your APS right now.');
      })
      .finally(() => setIsCalculating(false));
  }

  if (loadError) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="cloud-off" size={28} color={theme.onSurfaceVariant} />
        <ThemedText type="default" themeColor="onSurfaceVariant" style={styles.errorText}>
          {loadError}
        </ThemedText>
      </View>
    );
  }

  if (!catalog) {
    return <ScreenLoading label="Loading subjects..." />;
  }

  const mySubjectNames = new Set(mySubjects.map((entry) => entry.subject));

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <ThemedText type="smallBold" themeColor="onSurfaceVariant">
          Are you currently in school, or have you finished (matriculated)?
        </ThemedText>
        <View style={styles.statusRow}>
          {SCHOOL_STATUS_OPTIONS.map((option) => {
            const selected = schoolStatus === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => selectSchoolStatus(option.value)}
                style={[styles.statusTab, { backgroundColor: selected ? theme.primary : theme.surfaceContainer }]}>
                <ThemedText type="smallBold" style={{ color: selected ? theme.onPrimary : theme.onSurface }}>
                  {option.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="smallBold" themeColor="onSurfaceVariant">
          {schoolStatus === 'finished' ? 'My Final NSC Results' : 'My Current Subjects'}
        </ThemedText>
        {mySubjects.length === 0 ? (
          <ThemedText type="small" themeColor="onSurfaceVariant">
            No subjects added yet — pick some below.
          </ThemedText>
        ) : (
          <View style={styles.subjectList}>
            {mySubjects.map((entry) => (
              <SubjectLevelRow
                key={entry.subject}
                score={entry}
                onLevelChange={(level) => changeLevel(entry.subject, level)}
                onRemove={() => removeSubject(entry.subject)}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <ThemedText type="smallBold" themeColor="onSurfaceVariant">
          Add Subjects
        </ThemedText>
        <AddSubjectPicker catalog={catalog} selectedNames={mySubjectNames} onToggle={toggleSubject} />
      </View>

      {calculateError && (
        <ThemedText type="small" themeColor="error" style={styles.centeredText}>
          {calculateError}
        </ThemedText>
      )}

      <Pressable
        onPress={calculate}
        disabled={mySubjects.length === 0 || isCalculating}
        style={({ pressed }) => [
          styles.calculateButton,
          { backgroundColor: theme.primary, opacity: mySubjects.length === 0 || isCalculating ? 0.5 : 1 },
          pressed && styles.pressed,
        ]}>
        <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
          {isCalculating ? 'Calculating...' : 'Calculate My APS & Unlock Careers'}
        </ThemedText>
      </Pressable>

      {apsResult && (
        <View style={[styles.resultCard, { backgroundColor: theme.surfaceContainerLowest, borderColor: theme.cardBorder }]}>
          <View style={styles.apsHeader}>
            <ThemedText type="title" style={styles.apsScore}>
              {apsResult.totalAps}
            </ThemedText>
            <ThemedText type="small" themeColor="onSurfaceVariant">
              Approximate APS Score
            </ThemedText>
          </View>
          {apsResult.subjectsExcluded && apsResult.subjectsExcluded.length > 0 && (
            <ThemedText type="small" themeColor="onSurfaceVariant" style={styles.centeredText}>
              Excluded: {apsResult.subjectsExcluded.map((s) => s.subject).join(', ')}
            </ThemedText>
          )}
          {apsResult.notes && (
            <ThemedText type="small" themeColor="outline" style={styles.centeredText}>
              {apsResult.notes}
            </ThemedText>
          )}
        </View>
      )}

      {unlockedResult && <UnlockedCareersPanel result={unlockedResult} />}

      {onContinue && (
        <Pressable
          onPress={onContinue}
          style={({ pressed }) => [
            styles.continueButton,
            { backgroundColor: theme.surfaceContainer },
            pressed && styles.pressed,
          ]}>
          <ThemedText type="smallBold">{continueLabel}</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
  },
  section: {
    gap: Spacing.two,
  },
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  statusTab: {
    flex: 1,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectList: {
    gap: Spacing.one,
  },
  calculateButton: {
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  resultCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  apsHeader: {
    alignItems: 'center',
    gap: 2,
  },
  apsScore: {
    fontSize: 36,
    lineHeight: 42,
  },
  centeredText: {
    textAlign: 'center',
    lineHeight: 18,
  },
  continueButton: {
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  errorText: {
    textAlign: 'center',
  },
});
