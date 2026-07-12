import { api } from '@/api/client';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/api';

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload, { auth: false }),

  register: (payload: RegisterPayload) =>
    api.post<string>('/users', payload, { auth: false }),
};
