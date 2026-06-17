import { create } from 'zustand';
import type { Challenge, LeaderboardEntry, User, WorkoutSession } from '@/types';
import { MOCK_LEADERBOARD, MOCK_USER } from '@/lib/data';
import { getLevelFromXP } from '@/lib/theme';

interface AppState {
  user: User;
  currentChallenge: Challenge | null;
  currentSession: Partial<WorkoutSession> | null;
  leaderboard: LeaderboardEntry[];
  completedChallenges: string[];

  setCurrentChallenge: (challenge: Challenge | null) => void;
  startSession: (challengeId: string) => void;
  updateSessionReps: (reps: number) => void;
  completeSession: (data: Omit<WorkoutSession, 'challengeId' | 'completedAt'>) => void;
  addXP: (amount: number) => void;
  resetSession: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: MOCK_USER,
  currentChallenge: null,
  currentSession: null,
  leaderboard: MOCK_LEADERBOARD,
  completedChallenges: [],

  setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),

  startSession: (challengeId) =>
    set({
      currentSession: {
        challengeId,
        repsCompleted: 0,
        timeTaken: 0,
        caloriesBurned: 0,
        xpEarned: 0,
      },
    }),

  updateSessionReps: (reps) =>
    set((state) => ({
      currentSession: state.currentSession
        ? { ...state.currentSession, repsCompleted: reps }
        : null,
    })),

  completeSession: (data) => {
    const { currentChallenge } = get();
    if (!currentChallenge) return;
    set((state) => ({
      currentSession: {
        ...state.currentSession,
        ...data,
        completedAt: new Date(),
      },
      completedChallenges: [...state.completedChallenges, currentChallenge.id],
    }));
  },

  addXP: (amount) =>
    set((state) => {
      const newXP = state.user.xp + amount;
      const newLevel = getLevelFromXP(newXP);
      const updatedUser = { ...state.user, xp: newXP, level: newLevel };

      const updatedLeaderboard = state.leaderboard.map((entry) =>
        entry.isCurrentUser ? { ...entry, xp: newXP, level: newLevel } : entry
      );

      updatedLeaderboard.sort((a, b) => b.xp - a.xp);
      updatedLeaderboard.forEach((entry, idx) => {
        entry.rank = idx + 1;
      });

      return { user: updatedUser, leaderboard: updatedLeaderboard };
    }),

  resetSession: () =>
    set({ currentSession: null, currentChallenge: null }),
}));
