import { ApsCalculationResult, CareersUnlockedResult, LearnerSubjectScore, Subject } from '@/data/subjects';

import { apiClient } from './api-client';

export const SubjectsService = {
  // GET /api/Subjects
  getSubjects(): Promise<Subject[]> {
    return apiClient.get<Subject[]>('/Subjects');
  },

  // POST /api/Aps/calculate
  calculateAps(scores: LearnerSubjectScore[]): Promise<ApsCalculationResult> {
    return apiClient.post<ApsCalculationResult>('/Aps/calculate', scores);
  },

  // POST /api/Careers/unlocked
  getCareersUnlocked(subjectNames: string[]): Promise<CareersUnlockedResult> {
    return apiClient.post<CareersUnlockedResult>('/Careers/unlocked', { subjects: subjectNames });
  },
};
