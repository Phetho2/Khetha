export const RIASEC_LABELS: Record<number, string> = {
  0: 'Realistic',
  1: 'Investigative',
  2: 'Artistic',
  3: 'Social',
  4: 'Enterprising',
  5: 'Conventional',
};

export type HollandCodeQuestion = {
  id: number;
  text: string;
  type: number;
};

export type AssessmentAnswer = {
  questionId: number;
  rating: number;
};

export type AssessmentResult = {
  realisticScore: number;
  investigativeScore: number;
  artisticScore: number;
  socialScore: number;
  enterprisingScore: number;
  conventionalScore: number;
  resultCode: string | null;
  persisted: boolean;
};

export type AssessmentSubmissionSummary = {
  id: string;
  submittedAtUtc: string;
  realisticScore: number;
  investigativeScore: number;
  artisticScore: number;
  socialScore: number;
  enterprisingScore: number;
  conventionalScore: number;
  resultCode: string | null;
};
