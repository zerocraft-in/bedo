export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  reps: number;
  xpReward: number;
  calories: number;
  duration: number; // seconds
  imageUrl: string;
  color: string;
  rules: string[];
  muscleGroups: string[];
}

export interface User {
  id: string;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  completedChallenges: string[];
  rank?: number;
}

export interface WorkoutSession {
  challengeId: string;
  repsCompleted: number;
  timeTaken: number;
  caloriesBurned: number;
  xpEarned: number;
  completedAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  rank: number;
  isCurrentUser?: boolean;
}
