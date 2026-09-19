export type Quote = {
  id: string;
  text: string;
  author: string;
};

export const QUOTES: Quote[] = [
  {
    id: 'von-neumann',
    text: 'People who do not believe that mathematics can be simple, then they simply do not realize how complicated life is.',
    author: 'John Von Neumann',
  },
  {
    id: 'mandela',
    text: 'Education is the great engine of personal development. It is through education that the daughter of a peasant can become a doctor, that the son of a mine worker can become the head of the mine, that a child of farm workers can become the president of a great nation. It is what we make out of what we have, not what we are given, that separates one person from another.',
    author: 'Nelson Mandela',
  },
  {
    id: 'buffett',
    text: "Without geography you're nowhere.",
    author: 'Jimmy Buffett',
  },
  {
    id: 'jobs',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
];
