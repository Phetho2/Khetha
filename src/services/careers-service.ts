import { Career } from '@/data/careers';

import { apiClient } from './api-client';
import { withCache } from './cache';

export const CareersService = {
  // GET /api/Careers — cached so career matches still resolve offline.
  getCareers(): Promise<Career[]> {
    return withCache('careers', () => apiClient.get<Career[]>('/Careers'));
  },
};
