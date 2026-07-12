import { api } from '@/api/client';
import type { User, UserProfile } from '@/types/api';

export const usersService = {
  getProfile: () => api.get<UserProfile>('/profile/me'),

  list: () => api.get<User[]>('/users'),
};
