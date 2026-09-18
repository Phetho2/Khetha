export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  grade?: number;
  language: string;
  track: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateLearnerProfileRequest = {
  name: string;
  grade?: number;
  language: string;
  track: string;
  latitude?: number;
  longitude?: number;
};

export type LearnerProfile = {
  id: string;
  name: string | null;
  email: string | null;
  grade: number;
  language: string | null;
  track: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAtUtc: string;
};

export type AuthResponse = {
  token: string;
  expiresAtUtc: string;
  learner: LearnerProfile;
};

export const LANGUAGE_OPTIONS = [
  'English',
  'Afrikaans',
  'isiZulu',
  'isiXhosa',
  'Sepedi',
  'Setswana',
  'Sesotho',
  'Xitsonga',
  'siSwati',
  'Tshivenda',
  'isiNdebele',
];
export const TRACK_OPTIONS = ['TVET Track', 'University Track', 'Undecided'];
