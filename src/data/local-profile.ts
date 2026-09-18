export type LearnerStage =
  | 'before-grade-10'
  | 'grade-10'
  | 'grade-11'
  | 'grade-12'
  | 'college-university'
  | 'looking-for-work'
  | 'parent-guardian'
  | 'teacher-practitioner';

export const STAGE_LABELS: Record<LearnerStage, string> = {
  'before-grade-10': 'Before Grade 10',
  'grade-10': 'Grade 10',
  'grade-11': 'Grade 11',
  'grade-12': 'Grade 12',
  'college-university': 'Student at college or university',
  'looking-for-work': 'Looking for work',
  'parent-guardian': 'Parent or guardian',
  'teacher-practitioner': 'Teacher or career practitioner',
};

export type OnboardingGoal = 'choose-subjects' | 'find-career' | 'study-options' | 'find-job' | 'help-someone-else';

export const GOAL_LABELS: Record<OnboardingGoal, { title: string; subtitle: string }> = {
  'choose-subjects': { title: 'Choose my school subjects', subtitle: 'Which subjects open the doors I want' },
  'find-career': { title: 'Find a career that suits me', subtitle: 'Answer a few questions and see what fits' },
  'study-options': { title: 'See what and where to study', subtitle: 'Qualifications, colleges and universities' },
  'find-job': { title: 'Find a job or learnership', subtitle: 'Work, internships and skills programmes' },
  'help-someone-else': { title: 'Help someone else choose', subtitle: 'For parents, teachers and practitioners' },
};

export type DisabilityStatus = 'no' | 'yes' | 'rather-not-say';

export const SA_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
] as const;

export type LocalProfile = {
  language: string | null;
  firstName: string;
  stage: LearnerStage | null;
  province: string | null;
  town: string;
  goals: OnboardingGoal[];
  biggerText: boolean;
  readToMe: boolean;
  saveData: boolean;
  workOffline: boolean;
  disabilityStatus: DisabilityStatus | null;
};

export const DEFAULT_LOCAL_PROFILE: LocalProfile = {
  language: null,
  firstName: '',
  stage: null,
  province: null,
  town: '',
  goals: [],
  biggerText: true,
  readToMe: true,
  saveData: true,
  workOffline: false,
  disabilityStatus: 'no',
};
