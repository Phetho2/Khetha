export type TermSubjectMark = {
  subject: string;
  percentage: number;
};

export type SubmitTermResultsRequest = {
  year?: number;
  term: number;
  subjects: TermSubjectMark[];
};

export type TermSubjectResult = {
  subject: string | null;
  percentage: number;
  level: number;
};

export type TermResultsResponse = {
  year: number;
  term: number;
  subjects: TermSubjectResult[] | null;
};

export type RequirementProgress = {
  requiredSubject: string | null;
  requiredLevelText: string | null;
  currentSubject: string | null;
  currentPercentage: number | null;
  currentLevel: number | null;
  levelsShort: number | null;
  met: boolean;
  message: string | null;
};

// "OnTrack" | "Close" | "NeedsAttention" | "NoMarks" | "NoRequirements"
export type CareerProgress = {
  careerId: number;
  title: string | null;
  status: string | null;
  requirements: RequirementProgress[] | null;
};

// "Improving" | "Declining" | "Steady" | "New"
export type SubjectTrend = {
  subject: string | null;
  latestPercentage: number;
  latestLevel: number;
  previousPercentage: number | null;
  change: number | null;
  trend: string | null;
};

export type TermProgressResponse = {
  latestYear: number | null;
  latestTerm: number | null;
  subjects: SubjectTrend[] | null;
  careers: CareerProgress[] | null;
  notes: string | null;
};

export type CoachFocusArea = {
  subject: string | null;
  advice: string | null;
};

export type CoachReply = {
  onTrack: boolean | null;
  summary: string | null;
  encouragement: string | null;
  focusAreas: CoachFocusArea[] | null;
};

export type CoachResponse = {
  progress: TermProgressResponse;
  coaching: CoachReply | null;
  notice: string | null;
};

export type MissingTerm = {
  year: number;
  term: number;
};

export type ReportCardStatusResponse = {
  missingTerms: MissingTerm[] | null;
  nextReminderOn: string | null;
};
