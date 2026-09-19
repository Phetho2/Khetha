import { Career } from '@/data/careers';

export type SavedCareer = {
  id: string;
  savedAtUtc: string;
  career: Career;
};
