import { SubjectRequirement } from '@/data/universities';

export type Career = {
  id: number;
  title: string | null;
  ofoCode: string | null;
  summary: string | null;
  responsibilities: string[] | null;
  requiredSubjects: SubjectRequirement[] | null;
  pathways: string[] | null;
  riasecTags: number[] | null;
};

export type CareerMatchResult = {
  careerId: number;
  title: string | null;
  subjectFitScore: number | null;
  riasecFitScore: number | null;
  overallScore: number;
  explanation: string | null;
};

export type CareerMatchResponse = {
  matches: CareerMatchResult[] | null;
  usedSubjects: boolean;
  usedRiasec: boolean;
  notes: string | null;
};

// A career merged with its match scores, for display. Scores are omitted
// when there's no ranking context (e.g. viewing a career from the Shortlist).
export type MatchedCareer = Career & {
  overallScore?: number;
  subjectFitScore?: number | null;
  riasecFitScore?: number | null;
};
