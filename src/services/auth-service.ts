import { AuthResponse, LearnerProfile, LoginRequest, RegisterRequest, UpdateLearnerProfileRequest } from '@/data/auth';

import { apiClient } from './api-client';

export const AuthService = {
  // POST /api/Auth/register
  register(payload: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/Auth/register', payload);
  },

  // POST /api/Auth/login
  login(payload: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/Auth/login', payload);
  },

  // GET /api/Learners/me
  getProfile(): Promise<LearnerProfile> {
    return apiClient.get<LearnerProfile>('/Learners/me');
  },

  // PUT /api/Learners/me
  updateProfile(payload: UpdateLearnerProfileRequest): Promise<LearnerProfile> {
    return apiClient.put<LearnerProfile>('/Learners/me', payload);
  },
};
