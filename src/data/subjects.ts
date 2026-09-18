export type Subject = {
  id: number;
  name: string;
  category: string;
  isDesignated: boolean;
  isCompulsory: boolean;
  notes: string | null;
};

export type LearnerSubjectScore = {
  subject: string;
  level: number;
};

export type ApsCalculationResult = {
  totalAps: number;
  subjectsCounted: LearnerSubjectScore[] | null;
  subjectsExcluded: LearnerSubjectScore[] | null;
  notes: string | null;
};

export type UnlockedCourse = {
  courseId: number;
  courseName: string | null;
  university: string | null;
  qualificationCode: string | null;
};

export type FacultyCareerGroup = {
  faculty: string | null;
  courses: UnlockedCourse[] | null;
};

export type CareersUnlockedResult = {
  facultiesUnlocked: FacultyCareerGroup[] | null;
  notes: string | null;
};
