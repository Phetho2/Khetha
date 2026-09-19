export type CalendarTerm = {
  term: number;
  opens: string;
  closes: string;
};

export type CalendarHoliday = {
  afterTerm: number;
  from: string;
  to: string;
};

export type CalendarReminder = {
  forYear: number;
  forTerm: number;
  date: string;
  title: string | null;
  message: string | null;
};

export type CalendarResponse = {
  year: number;
  terms: CalendarTerm[] | null;
  holidays: CalendarHoliday[] | null;
  reportCardReminders: CalendarReminder[] | null;
};
