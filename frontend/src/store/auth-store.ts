import { create } from 'zustand';

import type { User } from '@/types/api';

type AuthState = {
  token: string | null;
  user: User | null;
  setSession: (session: { token: string; user: User }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setSession: ({ token, user }) => set({ token, user }),
  clearSession: () => set({ token: null, user: null }),
}));
