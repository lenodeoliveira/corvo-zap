import { create } from 'zustand';

import { sessionStorage } from '@/storage/session-storage';
import type { User } from '@/types/api';

type AuthState = {
  token: string | null;
  user: User | null;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setSession: (session: { token: string; user: User }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isHydrated: false,

  hydrate: async () => {
    const session = await sessionStorage.load();

    if (session) {
      set({ token: session.token, user: session.user, isHydrated: true });
      return;
    }

    set({ isHydrated: true });
  },

  setSession: ({ token, user }) => {
    void sessionStorage.save({ token, user });
    set({ token, user });
  },

  clearSession: () => {
    void sessionStorage.clear();
    set({ token: null, user: null });
  },
}));
