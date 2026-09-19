import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { AuthResponse, LearnerProfile, LoginRequest, RegisterRequest, UpdateLearnerProfileRequest } from '@/data/auth';
import { setAuthToken } from '@/services/api-client';
import { AuthService } from '@/services/auth-service';
import { AuthStorage } from '@/services/auth-storage';
import { PushNotificationsService } from '@/services/push-notifications-service';

type AuthContextValue = {
  learner: LearnerProfile | null;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateLearnerProfileRequest) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function persistSession(session: AuthResponse) {
  await AuthStorage.setToken(session.token);
  setAuthToken(session.token);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [learner, setLearner] = useState<LearnerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    AuthStorage.getToken()
      .then(async (token) => {
        if (!token || cancelled) return;
        setAuthToken(token);
        const profile = await AuthService.getProfile();
        if (!cancelled) setLearner(profile);
      })
      .catch(async () => {
        // Stored token is invalid or expired — drop it silently.
        setAuthToken(null);
        await AuthStorage.clearToken();
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(payload: LoginRequest) {
    const session = await AuthService.login(payload);
    await persistSession(session);
    setLearner(session.learner);
  }

  async function register(payload: RegisterRequest) {
    const session = await AuthService.register(payload);
    await persistSession(session);
    setLearner(session.learner);
  }

  async function logout() {
    // Best-effort, and must happen before the auth token is cleared — the
    // unregister endpoint requires auth.
    await PushNotificationsService.unregisterDevice().catch(() => {});
    setAuthToken(null);
    await AuthStorage.clearToken();
    setLearner(null);
  }

  async function updateProfile(payload: UpdateLearnerProfileRequest) {
    const profile = await AuthService.updateProfile(payload);
    setLearner(profile);
  }

  return (
    <AuthContext.Provider value={{ learner, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
