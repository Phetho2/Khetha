import { Career } from '@/data/careers';

const STOPWORDS = new Set([
  'bachelor', 'of', 'in', 'and', 'or', 'the', 'all', 'except', 'specialising', 'specialisations',
  'science', 'business', 'national', 'diploma', 'certificate', 'higher', 'degree', 'honours',
  'bcom', 'bsc', 'beng', 'llb', 'advanced', 'general', 'programme', 'studies', 'a', 'for', 'with', 'most',
]);

const MIN_OVERLAP = 2;
const MAX_MATCHES = 3;

function tokenize(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !STOPWORDS.has(word));
  return new Set(words);
}

// Career.pathways holds qualification-style strings (e.g. "BEng Civil Engineering") meant to
// describe how you get into that career. There's no direct id linking a university Course to a
// Career, so this matches on shared significant words between the course name and those pathways.
export function matchCareersToCourse(courseName: string, careers: Career[]): Career[] {
  const courseTokens = tokenize(courseName);

  return careers
    .map((career) => {
      const pathwayTokens = new Set((career.pathways ?? []).flatMap((pathway) => Array.from(tokenize(pathway))));
      const overlap = Array.from(pathwayTokens).filter((token) => courseTokens.has(token)).length;
      return { career, overlap };
    })
    .filter((entry) => entry.overlap >= MIN_OVERLAP)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, MAX_MATCHES)
    .map((entry) => entry.career);
}
