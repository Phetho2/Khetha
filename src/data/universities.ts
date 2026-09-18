export type SubjectRequirement = {
  subject: string | null;
  level: string | null;
};

export type Course = {
  id: number;
  name: string | null;
  qualificationCode: string | null;
  duration: string | null;
  faculty: string | null;
  campus: string | null;
  subjectRequirements: SubjectRequirement[] | null;
  totalAPS: number;
  notes: string | null;
};

export type University = {
  id: number;
  name: string | null;
  website: string | null;
  prospectusUrl: string | null;
  courses: Course[] | null;
};
