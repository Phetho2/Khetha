import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { OnboardingStorage } from '@/services/onboarding-storage';

type OnboardingContextValue = {
  isComplete: boolean | null;
  complete: () => Promise<void>;
  hasSeenWelcome: boolean;
  markWelcomeSeen: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  // Deliberately in-memory only (not persisted) — the welcome screen should
  // reappear every time the app cold-starts, not just on the very first ever launch.
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    let cancelled = false;
    OnboardingStorage.isComplete().then((value) => {
      if (!cancelled) setIsComplete(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function complete() {
    await OnboardingStorage.setComplete();
    setIsComplete(true);
  }

  function markWelcomeSeen() {
    setHasSeenWelcome(true);
  }

  return (
    <OnboardingContext.Provider value={{ isComplete, complete, hasSeenWelcome, markWelcomeSeen }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding must be used within an OnboardingProvider');
  return context;
}
