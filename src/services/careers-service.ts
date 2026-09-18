import { Career } from '@/data/careers';

import { apiClient } from './api-client';

export const CareersService = {
  // GET /api/Careers
  getCareers(): Promise<Career[]> {
    return apiClient.get<Career[]>('/Careers');
  },
};
