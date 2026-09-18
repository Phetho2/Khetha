import { University } from '@/data/universities';

import { apiClient } from './api-client';

export const UniversitiesService = {
  // GET /api/Universities
  getUniversities(): Promise<University[]> {
    return apiClient.get<University[]>('/Universities');
  },
};
