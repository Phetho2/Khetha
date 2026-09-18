import AsyncStorage from '@react-native-async-storage/async-storage';

import { LearnerSubjectScore } from '@/data/subjects';

const SUBJECTS_KEY = 'khetha_subject_plan';
const SCHOOL_STATUS_KEY = 'khetha_school_status';

export type SchoolStatus = 'in-school' | 'finished';

export const SubjectPlanStorage = {
  async getSubjects(): Promise<LearnerSubjectScore[]> {
    const raw = await AsyncStorage.getItem(SUBJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
  },
  async setSubjects(subjects: LearnerSubjectScore[]): Promise<void> {
    await AsyncStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
  },
  async getSchoolStatus(): Promise<SchoolStatus | null> {
    const raw = await AsyncStorage.getItem(SCHOOL_STATUS_KEY);
    return raw === 'in-school' || raw === 'finished' ? raw : null;
  },
  async setSchoolStatus(status: SchoolStatus): Promise<void> {
    await AsyncStorage.setItem(SCHOOL_STATUS_KEY, status);
  },
};
