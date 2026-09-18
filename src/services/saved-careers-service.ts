import { SavedCareer } from '@/data/saved-careers';

import { apiClient } from './api-client';

export const SavedCareersService = {
  // GET /api/Journey/careers
  getSavedCareers(): Promise<SavedCareer[]> {
    return apiClient.get<SavedCareer[]>('/Journey/careers');
  },
};
