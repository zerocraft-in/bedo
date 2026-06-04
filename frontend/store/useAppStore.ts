import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, WorkoutSession, ChatMessage, ThemeMode } from '../types';
import { mockWorkoutHistory } from '../data/mockData';

interface AppState {
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  user: User;
  workoutHistory: WorkoutSession[];
  chatMessages: ChatMessage[];
  sessionId: string;
  themeMode: ThemeMode;
  init: () => Promise<void>;
  completeOnboarding: (user: User) => Promise<void>;
  setThemeMode: (mode: ThemeMode) => void;
  addChatMessage: (message: ChatMessage) => void;
  addWorkoutSession: (session: WorkoutSession) => void;
  updateUser: (updates: Partial<User>) => void;
}

const DEFAULT_USER: User = {
  name: 'Alex',
  goal: 'build_muscle',
  fitnessLevel: 'intermediate',
  workoutStyle: 'gym',
  streak: 12,
  totalWorkouts: 47,
  weight: 75,
  targetWeight: 70,
  joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  caloriesGoal: 500,
  workoutsGoal: 5,
};

export const useAppStore = create<AppState>((set, get) => ({
  isLoading: true,
  hasCompletedOnboarding: false,
  user: DEFAULT_USER,
  workoutHistory: mockWorkoutHistory,
  chatMessages: [],
  sessionId: `session-${Date.now()}`,
  themeMode: 'system',

  init: async () => {
    try {
      const [onboarded, userData, history, theme, messages] = await Promise.all([
        AsyncStorage.getItem('hasCompletedOnboarding'),
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('workoutHistory'),
        AsyncStorage.getItem('themeMode'),
        AsyncStorage.getItem('chatMessages'),
      ]);
      set({
        isLoading: false,
        hasCompletedOnboarding: onboarded === 'true',
        user: userData ? JSON.parse(userData) : DEFAULT_USER,
        workoutHistory: history ? JSON.parse(history) : mockWorkoutHistory,
        themeMode: (theme as ThemeMode) || 'system',
        chatMessages: messages ? JSON.parse(messages) : [],
      });
    } catch {
      set({ isLoading: false });
    }
  },

  completeOnboarding: async (user: User) => {
    await AsyncStorage.multiSet([
      ['hasCompletedOnboarding', 'true'],
      ['user', JSON.stringify(user)],
    ]);
    set({ hasCompletedOnboarding: true, user });
  },

  setThemeMode: (mode: ThemeMode) => {
    AsyncStorage.setItem('themeMode', mode);
    set({ themeMode: mode });
  },

  addChatMessage: (message: ChatMessage) => {
    const updated = [...get().chatMessages, message];
    AsyncStorage.setItem('chatMessages', JSON.stringify(updated.slice(-100)));
    set({ chatMessages: updated });
  },

  addWorkoutSession: (session: WorkoutSession) => {
    const updated = [session, ...get().workoutHistory];
    AsyncStorage.setItem('workoutHistory', JSON.stringify(updated));
    const currentUser = get().user;
    const updatedUser = {
      ...currentUser,
      totalWorkouts: currentUser.totalWorkouts + 1,
      streak: currentUser.streak + 1,
    };
    AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    set({ workoutHistory: updated, user: updatedUser });
  },

  updateUser: (updates: Partial<User>) => {
    const updated = { ...get().user, ...updates };
    AsyncStorage.setItem('user', JSON.stringify(updated));
    set({ user: updated });
  },
}));
