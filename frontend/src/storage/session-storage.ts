import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { User } from '@/types/api';

const SESSION_KEY = 'auth_session';

export type StoredSession = {
  token: string;
  user: User;
};

function parseSession(raw: string): StoredSession | null {
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

async function readItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
}

async function writeItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

export const sessionStorage = {
  save: async (session: StoredSession) => {
    await writeItem(SESSION_KEY, JSON.stringify(session));
  },

  load: async (): Promise<StoredSession | null> => {
    const raw = await readItem(SESSION_KEY);

    if (!raw) {
      return null;
    }

    const session = parseSession(raw);

    if (!session) {
      await removeItem(SESSION_KEY);
      return null;
    }

    return session;
  },

  clear: async () => {
    await removeItem(SESSION_KEY);
  },
};
