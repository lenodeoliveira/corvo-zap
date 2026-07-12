import { api } from '@/api/client';
import type { City } from '@/types/api';

export const citiesService = {
  getById: (id: string) => api.get<City>(`/cities/${id}`),
};
