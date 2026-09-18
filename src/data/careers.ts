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
