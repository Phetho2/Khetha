import { University } from '@/data/universities';

import { apiClient } from './api-client';
import { withCache } from './cache';

export const UniversitiesService = {
  // GET /api/Universities — cached so course details/links still work offline.
  getUniversities(): Promise<University[]> {
    return withCache('universities', () => apiClient.get<University[]>('/Universities'));
  },
};
