import { api } from '@/api/client';
import type { PaginatedResponse, User, UserProfile } from '@/types/api';

type ListUsersParams = {
  search?: string;
  page?: number;
  limit?: number;
};

function buildUsersQuery(params?: ListUsersParams): string {
  if (!params) {
    return '';
  }

  const query = new URLSearchParams();

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }

  if (params.page) {
    query.set('page', String(params.page));
  }

  if (params.limit) {
    query.set('limit', String(params.limit));
  }

  const serialized = query.toString();
  return serialized ? `?${serialized}` : '';
}

export const usersService = {
  getProfile: () => api.get<UserProfile>('/profile/me'),

  list: (params?: ListUsersParams) =>
    api.get<PaginatedResponse<User>>(`/users${buildUsersQuery(params)}`),
};
