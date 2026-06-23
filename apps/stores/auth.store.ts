import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  email: string;
  onboardingComplete: boolean;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: User;
}

interface AuthState {
  session: Session | null;
  isLoading: boolean;

  restoreSession: () => Promise<void>;

  login: (session: Session) => Promise<void>;

  logout: () => Promise<void>;

  completeOnboarding: () => Promise<void>;
}

const STORAGE_KEY =
  "@fitness_app_session";

export const useAuthStore =
  create<AuthState>((set, get) => ({
    session: null,

    isLoading: true,

    restoreSession: async () => {
      try {
        const raw =
          await AsyncStorage.getItem(
            STORAGE_KEY
          );

        if (!raw) {
          set({
            isLoading: false,
          });

          return;
        }

        const session =
          JSON.parse(raw);

        if (
          session.expiresAt <
          Date.now()
        ) {
          await AsyncStorage.removeItem(
            STORAGE_KEY
          );

          set({
            session: null,
            isLoading: false,
          });

          return;
        }

        set({
          session,
          isLoading: false,
        });
      } catch {
        set({
          isLoading: false,
        });
      }
    },

    login: async (
      session
    ) => {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(session)
      );

      set({
        session,
      });
    },

    logout: async () => {
      await AsyncStorage.removeItem(
        STORAGE_KEY
      );

      set({
        session: null,
      });
    },

    completeOnboarding:
      async () => {
        const current =
          get().session;

        if (!current) return;

        const updated = {
          ...current,

          user: {
            ...current.user,

            onboardingComplete:
              true,
          },
        };

        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        );

        set({
          session: updated,
        });
      },
  }));