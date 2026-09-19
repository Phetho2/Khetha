import {
  CoachResponse,
  ReportCardStatusResponse,
  SubmitTermResultsRequest,
  TermProgressResponse,
  TermResultsResponse,
} from '@/data/term-results';

import { apiClient } from './api-client';

export const TermResultsService = {
  // GET /api/TermResults — the signed-in learner's entered marks, most recent first.
  getTermResults(year?: number): Promise<TermResultsResponse[]> {
    return apiClient.get<TermResultsResponse[]>(year ? `/TermResults?year=${year}` : '/TermResults');
  },

  // POST /api/TermResults — enters or corrects one term's marks. Safe to retry.
  submitTermResults(payload: SubmitTermResultsRequest): Promise<TermResultsResponse> {
    return apiClient.post<TermResultsResponse>('/TermResults', payload);
  },

  // GET /api/TermResults/progress — on-track check against saved careers (or one careerId).
  getProgress(careerId?: number): Promise<TermProgressResponse> {
    return apiClient.get<TermProgressResponse>(
      careerId ? `/TermResults/progress?careerId=${careerId}` : '/TermResults/progress',
    );
  },

  // POST /api/TermResults/coach — same as getProgress, plus AI coaching.
  getCoaching(careerId?: number): Promise<CoachResponse> {
    return apiClient.post<CoachResponse>(
      careerId ? `/TermResults/coach?careerId=${careerId}` : '/TermResults/coach',
      {},
    );
  },

  // GET /api/TermResults/status — which terms' marks are overdue, and the next reminder date.
  getStatus(): Promise<ReportCardStatusResponse> {
    return apiClient.get<ReportCardStatusResponse>('/TermResults/status');
  },
};
