import { SavedCareer } from '@/data/saved-careers';

import { apiClient } from './api-client';

export const SavedCareersService = {
  // GET /api/Journey/careers — most recently saved first.
  getSavedCareers(): Promise<SavedCareer[]> {
    return apiClient.get<SavedCareer[]>('/Journey/careers');
  },

  // POST /api/Journey/careers/{careerId} — idempotent.
  saveCareer(careerId: number): Promise<SavedCareer> {
    return apiClient.post<SavedCareer>(`/Journey/careers/${careerId}`, {});
  },

  // DELETE /api/Journey/careers/{careerId} — idempotent, returns 204.
  unsaveCareer(careerId: number): Promise<void> {
    return apiClient.delete<void>(`/Journey/careers/${careerId}`);
  },
};
