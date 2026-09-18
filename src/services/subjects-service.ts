import { ApsCalculationResult, CareersUnlockedResult, LearnerSubjectScore, Subject } from '@/data/subjects';

import { apiClient } from './api-client';
import { withCache } from './cache';

export const SubjectsService = {
  // GET /api/Subjects — cached so the catalog still browses offline.
  getSubjects(): Promise<Subject[]> {
    return withCache('subjects', () => apiClient.get<Subject[]>('/Subjects'));
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
