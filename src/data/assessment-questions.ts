export type RiasecMeta = {
  label: string;
  icon: string;
  color: string;
  blurb: string;
};

export const RIASEC_META: Record<number, RiasecMeta> = {
  0: { label: 'Realistic', icon: 'build', color: '#C2410C', blurb: 'Hands-on, practical, and good with tools or machines.' },
  1: { label: 'Investigative', icon: 'science', color: '#1D4ED8', blurb: 'Curious, analytical, and drawn to solving problems.' },
  2: { label: 'Artistic', icon: 'palette', color: '#7C3AED', blurb: 'Creative, expressive, and drawn to original ideas.' },
  3: { label: 'Social', icon: 'diversity-3', color: '#DB2777', blurb: 'Caring, people-focused, and drawn to helping others.' },
  4: { label: 'Enterprising', icon: 'trending-up', color: '#B45309', blurb: 'Confident, persuasive, and drawn to leading or selling.' },
  5: { label: 'Conventional', icon: 'checklist', color: '#0F766E', blurb: 'Organised, detail-focused, and drawn to structure.' },
};

export const RIASEC_LABELS: Record<number, string> = Object.fromEntries(
  Object.entries(RIASEC_META).map(([key, meta]) => [key, meta.label]),
);

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
