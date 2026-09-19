import { Career, CareerMatchResponse } from '@/data/careers';
import { LearnerSubjectScore } from '@/data/subjects';

import { apiClient } from './api-client';
import { withCache } from './cache';

export const CareersService = {
  // GET /api/Careers — cached so career matches still resolve offline.
  getCareers(): Promise<Career[]> {
    return withCache('careers', () => apiClient.get<Career[]>('/Careers'));
  },

  // POST /api/Careers/match — ranks the directory against subjects and/or
  // (when signed in) the learner's most recent job-fit quiz result.
  matchCareers(subjects: LearnerSubjectScore[]): Promise<CareerMatchResponse> {
    return apiClient.post<CareerMatchResponse>('/Careers/match', { subjects });
  },
};
