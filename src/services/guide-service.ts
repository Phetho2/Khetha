import { GuideResponse } from '@/data/guide';

import { apiClient } from './api-client';
import { withCache } from './cache';

export const GuideService = {
  // GET /api/Guide — the "After School" video playlist. Cached so the
  // episode list still shows offline.
  getGuide(): Promise<GuideResponse> {
    return withCache('guide', () => apiClient.get<GuideResponse>('/Guide'));
  },
};
