import { CalendarResponse } from '@/data/school-calendar';

import { apiClient } from './api-client';
import { withCache } from './cache';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const CalendarService = {
  // GET /api/Calendar/{year} — public, no auth required.
  getCalendar(year: number): Promise<CalendarResponse> {
    return withCache(`calendar_${year}`, () => apiClient.get<CalendarResponse>(`/Calendar/${year}`));
  },

  // GET /api/Calendar/{year}/ics — the school year as an .ics file, for
  // importing term dates and report-card reminders into a device calendar.
  getIcsUrl(year: number): string {
    return `${API_BASE_URL}/Calendar/${year}/ics`;
  },
};
