import { AssessmentAnswer, AssessmentResult, AssessmentSubmissionSummary, HollandCodeQuestion } from '@/data/assessment-questions';

import { apiClient } from './api-client';
import { withCache } from './cache';

export const AssessmentService = {
  // GET /api/Assessment/questions — cached so the quiz can still be reviewed/retaken offline.
  getQuestions(): Promise<HollandCodeQuestion[]> {
    return withCache('assessment_questions', () => apiClient.get<HollandCodeQuestion[]>('/Assessment/questions'));
  },

  // POST /api/Assessment/submit
  submitAnswers(answers: AssessmentAnswer[]): Promise<AssessmentResult> {
    return apiClient.post<AssessmentResult>('/Assessment/submit', { answers });
  },

  // GET /api/Learners/me/assessments
  getMyAssessments(): Promise<AssessmentSubmissionSummary[]> {
    return apiClient.get<AssessmentSubmissionSummary[]>('/Learners/me/assessments');
  },
};
