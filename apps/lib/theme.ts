export const Colors = {
  primary: '#4F46E5',
  secondary: '#7C3AED',
  accent: '#06B6D4',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  background: '#0A0A0F',
  surface: '#12121A',
  surfaceLight: '#1A1A2E',
  card: '#16213E',
  cardBorder: '#1E2D4A',

  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#475569',

  beginner: '#10B981',
  intermediate: '#F59E0B',
  advanced: '#EF4444',

  gradient: {
    primary: ['#4F46E5', '#7C3AED'],
    accent: ['#06B6D4', '#4F46E5'],
    success: ['#10B981', '#059669'],
    card: ['#1A1A2E', '#16213E'],
    dark: ['#0A0A0F', '#12121A'],
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 48,
    fontWeight: '800' as const,
    letterSpacing: -1,
  },
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  label: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
};

export const XP_PER_LEVEL = 500;

export function getLevelFromXP(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getXPProgressInLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Beginner': return Colors.beginner;
    case 'Intermediate': return Colors.intermediate;
    case 'Advanced': return Colors.advanced;
    default: return Colors.primary;
  }
}
