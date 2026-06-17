import type { Challenge, LeaderboardEntry, User, WorkoutSession } from '../types';

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'pushup-20',
    title: 'Push-Up Challenge',
    description:
      'Build upper body strength with this classic push-up challenge. Perfect your form and crush your target reps.',
    difficulty: 'Beginner',
    reps: 20,
    xpReward: 50,
    calories: 40,
    duration: 120,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    color: '#10B981',
    rules: [
      'Keep your body straight from head to heels',
      'Lower chest to just above the floor',
      'Elbows at 45° angle to your body',
      'Full extension at the top of each rep',
    ],
    muscleGroups: ['Chest', 'Triceps', 'Shoulders', 'Core'],
  },
  {
    id: 'squat-30',
    title: 'Squat Challenge',
    description:
      'Power up your legs and glutes with this squat challenge. Focus on depth and control for maximum gains.',
    difficulty: 'Intermediate',
    reps: 30,
    xpReward: 70,
    calories: 60,
    duration: 180,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800',
    color: '#F59E0B',
    rules: [
      'Feet shoulder-width apart, toes slightly out',
      'Keep chest up and back straight',
      'Thighs parallel to floor at bottom',
      'Drive through heels on the way up',
    ],
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
  },
  {
    id: 'jumpingjack-50',
    title: 'Jumping Jack Challenge',
    description:
      'Get your heart pumping with 50 jumping jacks. This cardio blast will torch calories and boost your energy.',
    difficulty: 'Advanced',
    reps: 50,
    xpReward: 100,
    calories: 80,
    duration: 240,
    imageUrl: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=800',
    color: '#EF4444',
    rules: [
      'Start with feet together, arms at sides',
      'Jump and spread feet while raising arms overhead',
      'Land softly with bent knees',
      'Return to start in one smooth motion',
    ],
    muscleGroups: ['Full Body', 'Cardio', 'Calves', 'Shoulders'],
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    userId: 'user-1',
    name: 'Alex',
    xp: 1500,
    level: 3,
    avatar: 'https://i.pravatar.cc/150?img=1',
    rank: 1,
  },
  {
    userId: 'user-2',
    name: 'Sarah',
    xp: 1300,
    level: 3,
    avatar: 'https://i.pravatar.cc/150?img=5',
    rank: 2,
  },
  {
    userId: 'user-3',
    name: 'John',
    xp: 1200,
    level: 3,
    avatar: 'https://i.pravatar.cc/150?img=3',
    rank: 3,
  },
  {
    userId: 'current-user',
    name: 'You',
    xp: 950,
    level: 2,
    avatar: 'https://i.pravatar.cc/150?img=8',
    rank: 4,
    isCurrentUser: true,
  },
  {
    userId: 'user-5',
    name: 'Maria',
    xp: 820,
    level: 2,
    avatar: 'https://i.pravatar.cc/150?img=9',
    rank: 5,
  },
  {
    userId: 'user-6',
    name: 'Chris',
    xp: 700,
    level: 2,
    avatar: 'https://i.pravatar.cc/150?img=11',
    rank: 6,
  },
];

export const MOCK_USER: User = {
  id: 'current-user',
  name: 'You',
  xp: 950,
  level: 2,
  avatar: 'https://i.pravatar.cc/150?img=8',
  completedChallenges: [],
};

export const MOCK_WORKOUT_HISTORY: WorkoutSession[] = [
  {
    challengeId: 'pushup-20',
    repsCompleted: 20,
    timeTaken: 95,
    caloriesBurned: 38,
    xpEarned: 50,
    completedAt: new Date(Date.now() - 86400000),
  },
  {
    challengeId: 'squat-30',
    repsCompleted: 30,
    timeTaken: 162,
    caloriesBurned: 58,
    xpEarned: 70,
    completedAt: new Date(Date.now() - 172800000),
  },
];
