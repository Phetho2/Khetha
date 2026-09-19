export type Deadline = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  daysLeftLabel: string;
  tone: 'funding' | 'deadline';
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function formatDaysLeft(closingDate: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(closingDate);
  target.setHours(0, 0, 0, 0);

  const days = Math.round((target.getTime() - today.getTime()) / MS_PER_DAY);
  if (days < 0) return 'Closed';
  if (days === 0) return 'Closes Today';
  return `${days} Day${days === 1 ? '' : 's'} Left`;
}

function universityDeadline(id: string, name: string, closingDate: Date): Deadline {
  return {
    id,
    eyebrow: 'APPLICATION DEADLINE',
    title: `${name} Applications Close`,
    description: 'Submit your online application, supporting documents and application fee before the deadline.',
    daysLeftLabel: formatDaysLeft(closingDate),
    tone: 'deadline',
  };
}

const UNIVERSITY_CLOSING_DATE = new Date(2026, 8, 30); // 30 September 2026

export const UPCOMING_DEADLINES: Deadline[] = [
  {
    id: 'nsfas',
    eyebrow: 'BURSARY MILESTONE',
    title: 'NSFAS 2026 Window Opens',
    description: 'Gather your ID document, parent/guardian consent affidavit, and matric mark statements early.',
    daysLeftLabel: '18 Days Left',
    tone: 'funding',
  },
  universityDeadline('wits', 'Wits', UNIVERSITY_CLOSING_DATE),
  universityDeadline('uj', 'UJ', UNIVERSITY_CLOSING_DATE),
  universityDeadline('up', 'UP', UNIVERSITY_CLOSING_DATE),
  universityDeadline('uct', 'UCT', UNIVERSITY_CLOSING_DATE),
];
