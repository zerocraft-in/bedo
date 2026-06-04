export type Goal = 'lose_weight' | 'build_muscle' | 'improve_endurance' | 'stay_active';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type WorkoutStyle = 'gym' | 'home' | 'outdoor' | 'mixed';
export type WorkoutCategory = 'running' | 'lifting' | 'yoga' | 'hiit' | 'stretching';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type MessageRole = 'user' | 'assistant';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface User {
  name: string;
  goal: Goal;
  fitnessLevel: FitnessLevel;
  workoutStyle: WorkoutStyle;
  streak: number;
  totalWorkouts: number;
  weight: number;
  targetWeight: number;
  joinDate: string;
  caloriesGoal: number;
  workoutsGoal: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  duration?: number;
  restTime: number;
  muscleGroup: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  category: WorkoutCategory;
  duration: number;
  difficulty: Difficulty;
  calories: number;
  imageUrl: string;
  exercises: Exercise[];
  description: string;
  tags: string[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  workoutId: string;
  workoutTitle: string;
  duration: number;
  caloriesBurned: number;
  completed: boolean;
  category: WorkoutCategory;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  type: 'daily' | 'weekly';
  unit: string;
  reward: string;
  completed: boolean;
  emoji: string;
}

export interface DayStat {
  day: string;
  calories: number;
  workouts: number;
  minutes: number;
  hasWorkout: boolean;
}
