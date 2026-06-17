// lib/stores/auth.store.ts

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  name: string;
  email: string;
  onboardingComplete: boolean;
}

export interface Session {
  token: string;
  expiresAt: number;
  user: User;
}

interface AuthState {
  session: Session | null;
  loading: boolean;

  restoreSession: () => Promise<void>;

  login: (session: Session) => Promise<void>;

  logout: () => Promise<void>;

  completeOnboarding: () => Promise<void>;
}

const SESSION_KEY = "@fitness_app_session";

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  loading: true,

  restoreSession: async () => {
    try {
      const raw = await AsyncStorage.getItem(SESSION_KEY);

      if (!raw) {
        set({ loading: false });
        return;
      }

      const session: Session = JSON.parse(raw);

      if (session.expiresAt < Date.now()) {
        await AsyncStorage.removeItem(SESSION_KEY);
        set({ session: null, loading: false });
        return;
      }

      set({
        session,
        loading: false,
      });
    } catch {
      set({
        loading: false,
      });
    }
  },

  login: async (session) => {
    await AsyncStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session)
    );

    set({ session });
  },

  logout: async () => {
    await AsyncStorage.removeItem(SESSION_KEY);

    set({
      session: null,
    });
  },

  completeOnboarding: async () => {
    const current = get().session;

    if (!current) return;

    const updated = {
      ...current,
      user: {
        ...current.user,
        onboardingComplete: true,
      },
    };

    await AsyncStorage.setItem(
      SESSION_KEY,
      JSON.stringify(updated)
    );

    set({
      session: updated,
    });
  },
}));