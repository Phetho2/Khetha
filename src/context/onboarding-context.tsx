import { createContext, useContext, useState, type ReactNode } from 'react';

type OnboardingState = {
  language: string;
  audience: 'school' | 'finished' | 'helper' | null;
  fullName: string;
  cell: string;
  email: string;
  age: string;
  province: string;
  track: string;
  grade: string;
  disability: string;
  subjects: string[];
};

type AccountDetails = Pick<OnboardingState, 'fullName' | 'cell' | 'email'>;

type OnboardingContextValue = OnboardingState & {
  setLanguage: (language: string) => void;
  setAudience: (audience: OnboardingState['audience']) => void;
  setAccount: (account: AccountDetails) => void;
  setProfile: (profile: Pick<OnboardingState, 'age' | 'province' | 'track' | 'grade' | 'disability'>) => void;
  setSubjects: (subjects: string[]) => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>({
    language: 'English',
    audience: null,
    fullName: '',
    cell: '',
    email: '',
    age: '',
    province: '',
    track: '',
    grade: '',
    disability: '',
    subjects: [],
  });

  return (
    <OnboardingContext.Provider value={{
      ...state,
      setLanguage: (language) => setState((current) => ({ ...current, language })),
      setAudience: (audience) => setState((current) => ({ ...current, audience })),
      setAccount: (account) => setState((current) => ({ ...current, ...account })),
      setProfile: (profile) => setState((current) => ({ ...current, ...profile })),
      setSubjects: (subjects) => setState((current) => ({ ...current, subjects })),
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const value = useContext(OnboardingContext);
  if (!value) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return value;
}
