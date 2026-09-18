export type SavedCareer = {
  id: string;
  savedAtUtc: string;
  career: {
    id: number;
    title: string | null;
  };
};
