import { WorkoutPlan, WorkoutSession, Achievement, Challenge, DayStat, WorkoutCategory } from '../types';

export const workoutPlans: WorkoutPlan[] = [
  {
    id: 'w1',
    title: 'Upper Body Power',
    category: 'lifting',
    duration: 45,
    difficulty: 'medium',
    calories: 380,
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    description: 'Build explosive upper body strength with compound movements and isolation work.',
    tags: ['Chest', 'Back', 'Shoulders'],
    exercises: [
      { id: 'e1', name: 'Bench Press', sets: 4, reps: '8-10', restTime: 90, muscleGroup: 'Chest' },
      { id: 'e2', name: 'Pull-Ups', sets: 3, reps: '8-12', restTime: 90, muscleGroup: 'Back' },
      { id: 'e3', name: 'Overhead Press', sets: 3, reps: '10-12', restTime: 60, muscleGroup: 'Shoulders' },
      { id: 'e4', name: 'Bicep Curls', sets: 3, reps: '12-15', restTime: 60, muscleGroup: 'Biceps' },
      { id: 'e5', name: 'Tricep Dips', sets: 3, reps: '12-15', restTime: 60, muscleGroup: 'Triceps' },
    ],
  },
  {
    id: 'w2',
    title: 'Morning Run 5K',
    category: 'running',
    duration: 35,
    difficulty: 'easy',
    calories: 320,
    imageUrl: 'https://images.unsplash.com/flagged/photo-1556746834-cbb4a38ee593?w=800&q=80',
    description: 'Start your day with a refreshing 5K run. Build cardiovascular endurance and burn calories.',
    tags: ['Cardio', 'Endurance', 'Legs'],
    exercises: [
      { id: 'e6', name: 'Warm Up Walk', duration: 5, restTime: 0, muscleGroup: 'Full Body' },
      { id: 'e7', name: 'Easy Jog', duration: 10, restTime: 0, muscleGroup: 'Legs' },
      { id: 'e8', name: 'Moderate Run', duration: 15, restTime: 0, muscleGroup: 'Legs' },
      { id: 'e9', name: 'Cool Down Walk', duration: 5, restTime: 0, muscleGroup: 'Full Body' },
    ],
  },
  {
    id: 'w3',
    title: 'Yoga Flow & Restore',
    category: 'yoga',
    duration: 40,
    difficulty: 'easy',
    calories: 180,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    description: 'Improve flexibility and reduce stress with this restorative yoga flow session.',
    tags: ['Flexibility', 'Mindfulness', 'Recovery'],
    exercises: [
      { id: 'e10', name: 'Sun Salutation', sets: 3, duration: 5, restTime: 30, muscleGroup: 'Full Body' },
      { id: 'e11', name: 'Warrior Sequence', sets: 2, duration: 8, restTime: 30, muscleGroup: 'Legs' },
      { id: 'e12', name: 'Hip Openers', duration: 10, restTime: 0, muscleGroup: 'Hips' },
      { id: 'e13', name: 'Final Savasana', duration: 5, restTime: 0, muscleGroup: 'Full Body' },
    ],
  },
  {
    id: 'w4',
    title: 'HIIT Cardio Blast',
    category: 'hiit',
    duration: 25,
    difficulty: 'hard',
    calories: 450,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    description: 'Maximum calorie burn in minimum time. High-intensity intervals for serious results.',
    tags: ['HIIT', 'Fat Burn', 'Conditioning'],
    exercises: [
      { id: 'e14', name: 'Burpees', sets: 4, reps: '10', restTime: 30, muscleGroup: 'Full Body' },
      { id: 'e15', name: 'Jump Squats', sets: 4, reps: '15', restTime: 30, muscleGroup: 'Legs' },
      { id: 'e16', name: 'Mountain Climbers', sets: 4, duration: 30, restTime: 30, muscleGroup: 'Core' },
      { id: 'e17', name: 'High Knees', sets: 4, duration: 30, restTime: 30, muscleGroup: 'Legs' },
    ],
  },
  {
    id: 'w5',
    title: 'Core & Abs',
    category: 'lifting',
    duration: 30,
    difficulty: 'medium',
    calories: 240,
    imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80',
    description: 'Sculpt a strong core with targeted ab exercises and functional movements.',
    tags: ['Core', 'Abs', 'Stability'],
    exercises: [
      { id: 'e18', name: 'Plank Hold', sets: 3, duration: 60, restTime: 30, muscleGroup: 'Core' },
      { id: 'e19', name: 'Crunches', sets: 3, reps: '20', restTime: 30, muscleGroup: 'Abs' },
      { id: 'e20', name: 'Leg Raises', sets: 3, reps: '15', restTime: 30, muscleGroup: 'Lower Abs' },
      { id: 'e21', name: 'Russian Twists', sets: 3, reps: '20', restTime: 30, muscleGroup: 'Obliques' },
    ],
  },
];

// Generate 30-day workout history
function generateHistory(): WorkoutSession[] {
  const categories: WorkoutCategory[] = ['lifting', 'running', 'yoga', 'hiit', 'stretching'];
  const titles = ['Upper Body Power', 'Morning Run 5K', 'Yoga Flow', 'HIIT Blast', 'Core & Abs'];
  const history: WorkoutSession[] = [];

  for (let i = 0; i < 30; i++) {
    // Skip some days (realistic 75% completion rate)
    if (i > 0 && Math.random() < 0.25) continue;

    const date = new Date();
    date.setDate(date.getDate() - i);
    const idx = Math.floor(Math.random() * 5);

    history.push({
      id: `session-${i}`,
      date: date.toISOString().split('T')[0],
      workoutId: `w${idx + 1}`,
      workoutTitle: titles[idx],
      duration: 25 + Math.floor(Math.random() * 35),
      caloriesBurned: 200 + Math.floor(Math.random() * 350),
      completed: true,
      category: categories[idx],
    });
  }
  return history;
}

export const mockWorkoutHistory: WorkoutSession[] = generateHistory();

// Last 7 days stats
export function getLast7DaysStats(history: WorkoutSession[]): DayStat[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const stats: DayStat[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = days[date.getDay()];

    const dayWorkouts = history.filter(s => s.date === dateStr);
    const totalCal = dayWorkouts.reduce((sum, s) => sum + s.caloriesBurned, 0);
    const totalMin = dayWorkouts.reduce((sum, s) => sum + s.duration, 0);

    stats.push({
      day: i === 0 ? 'Today' : dayName,
      calories: totalCal,
      workouts: dayWorkouts.length,
      minutes: totalMin,
      hasWorkout: dayWorkouts.length > 0,
    });
  }
  return stats;
}

export const achievements: Achievement[] = [
  { id: 'a1', title: 'First Step', description: 'Completed your first workout', emoji: '🎯', unlocked: true, unlockedAt: '2024-11-01', requirement: 'Complete 1 workout' },
  { id: 'a2', title: 'Week Warrior', description: '7-day workout streak', emoji: '🔥', unlocked: true, unlockedAt: '2024-11-15', requirement: '7-day streak' },
  { id: 'a3', title: 'Iron Will', description: '30 workouts completed', emoji: '💪', unlocked: true, unlockedAt: '2024-12-01', requirement: '30 workouts' },
  { id: 'a4', title: 'Speed Demon', description: 'Complete 5 running workouts', emoji: '⚡', unlocked: true, unlockedAt: '2024-12-10', requirement: '5 runs' },
  { id: 'a5', title: 'Zen Master', description: 'Complete 10 yoga sessions', emoji: '🧘', unlocked: false, requirement: '10 yoga sessions' },
  { id: 'a6', title: 'Century Club', description: 'Complete 100 workouts', emoji: '🏆', unlocked: false, requirement: '100 workouts' },
  { id: 'a7', title: 'Calorie Crusher', description: 'Burn 10,000 calories total', emoji: '🔥', unlocked: false, requirement: '10k calories' },
  { id: 'a8', title: 'Consistency King', description: '30-day workout streak', emoji: '👑', unlocked: false, requirement: '30-day streak' },
];

export const challenges: Challenge[] = [
  {
    id: 'c1',
    title: '100 Push-Ups',
    description: 'Complete 100 push-ups throughout the day',
    target: 100,
    current: 67,
    type: 'daily',
    unit: 'reps',
    reward: '50 XP',
    completed: false,
    emoji: '💪',
  },
  {
    id: 'c2',
    title: '10,000 Steps',
    description: 'Reach 10,000 steps today',
    target: 10000,
    current: 8432,
    type: 'daily',
    unit: 'steps',
    reward: '30 XP',
    completed: false,
    emoji: '👟',
  },
  {
    id: 'c3',
    title: '5 Workouts This Week',
    description: 'Complete 5 workouts this week',
    target: 5,
    current: 3,
    type: 'weekly',
    unit: 'workouts',
    reward: '200 XP + Badge',
    completed: false,
    emoji: '🏋️',
  },
  {
    id: 'c4',
    title: 'Burn 2,500 Cal',
    description: 'Burn 2,500 calories this week',
    target: 2500,
    current: 1840,
    type: 'weekly',
    unit: 'cal',
    reward: '150 XP',
    completed: false,
    emoji: '🔥',
  },
  {
    id: 'c5',
    title: 'Morning Workout',
    description: 'Complete a workout before 9 AM',
    target: 1,
    current: 1,
    type: 'daily',
    unit: 'workout',
    reward: '75 XP',
    completed: true,
    emoji: '🌅',
  },
];

export const motivationalMessages = [
  "You're on a 12-day streak! Every rep is writing your success story. 🔥",
  "Your consistency is building something powerful. Keep showing up!",
  "Champions are made in the moments they don't feel like training. Go!",
  "You've already done the hardest part — deciding to start. Finish strong!",
  "Your body is capable of more than your mind believes. Trust the process.",
];
