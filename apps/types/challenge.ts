// types/challenge.ts
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'community';
  exercises: ChallengeExercise[];
  startDate: Date;
  endDate: Date;
  rewardPoints: number;
  badgeId?: string;
  communityId?: string; // for community challenges
}

export interface ChallengeExercise {
  exerciseType: ExerciseType; // 'squat' | 'pushup' | 'lunge' | 'jumping_jack' | 'plank'
  targetCount?: number;       // for rep-based exercises
  targetDuration?: number;    // for plank (seconds)
  formRules: FormRules;
}

export interface FormRules {
  requiredAngle?: { joint: string; min?: number; max?: number }; // e.g., knee angle < 90°
  requiredAlignment?: { joint1: string; joint2: string; relation: 'above' | 'below' };
  // ... more rules per exercise
}

export interface UserProgress {
  challengeId: string;
  exerciseIndex: number;
  currentCount: number;          // valid reps completed
  totalTarget: number;
  startTime: number;
  lastUpdate: number;
  completed: boolean;
  invalidAttempts: number;       // anti-cheat
}

export interface WorkoutSession {
  id: string;
  userId: string;
  challengeId: string;
  startedAt: number;
  endedAt?: number;
  repsPerExercise: { [exerciseIndex: number]: number };
  pointsEarned: number;
  badgeEarned?: string;
}