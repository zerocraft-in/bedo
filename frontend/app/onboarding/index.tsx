import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
  ImageBackground, ScrollView, useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSpring,
  FadeInRight, FadeOutLeft,
} from 'react-native-reanimated';
import { useAppStore } from '../../store/useAppStore';
import { Colors } from '../../utils/theme';
import { Goal, FitnessLevel, WorkoutStyle } from '../../types';

const { width } = Dimensions.get('window');

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
];

const GOALS: { key: Goal; label: string; emoji: string; desc: string }[] = [
  { key: 'lose_weight', label: 'Lose Weight', emoji: '🔥', desc: 'Burn fat & get lean' },
  { key: 'build_muscle', label: 'Build Muscle', emoji: '💪', desc: 'Gain strength & size' },
  { key: 'improve_endurance', label: 'Endurance', emoji: '⚡', desc: 'Boost cardio capacity' },
  { key: 'stay_active', label: 'Stay Active', emoji: '🏃', desc: 'Move every day' },
];

const LEVELS: { key: FitnessLevel; label: string; emoji: string; desc: string }[] = [
  { key: 'beginner', label: 'Beginner', emoji: '🌱', desc: '0–6 months experience' },
  { key: 'intermediate', label: 'Intermediate', emoji: '🔥', desc: '6 months – 2 years' },
  { key: 'advanced', label: 'Advanced', emoji: '💎', desc: '2+ years training' },
];

const STYLES: { key: WorkoutStyle; label: string; emoji: string; desc: string }[] = [
  { key: 'gym', label: 'Gym', emoji: '🏋️', desc: 'Weight & machines' },
  { key: 'home', label: 'Home', emoji: '🏠', desc: 'No equipment needed' },
  { key: 'outdoor', label: 'Outdoor', emoji: '🌿', desc: 'Parks & trails' },
  { key: 'mixed', label: 'Mixed', emoji: '🎯', desc: 'Best of all worlds' },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal>('build_muscle');
  const [level, setLevel] = useState<FitnessLevel>('intermediate');
  const [style, setStyle] = useState<WorkoutStyle>('gym');
  const [name, setName] = useState('Alex');
  const { completeOnboarding } = useAppStore();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Colors.dark : Colors.light;

  const handleNext = async () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      await completeOnboarding({
        name,
        goal,
        fitnessLevel: level,
        workoutStyle: style,
        streak: 12,
        totalWorkouts: 47,
        weight: 75,
        targetWeight: 70,
        joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        caloriesGoal: 500,
        workoutsGoal: 5,
      });
      router.replace('/(tabs)');
    }
  };

  const steps = [
    {
      title: 'What\'s Your Goal?',
      subtitle: 'We\'ll build your personalized plan',
      image: HERO_IMAGES[0],
      content: (
        <View style={styles.optionsGrid}>
          {GOALS.map(g => (
            <TouchableOpacity
              key={g.key}
              testID={`goal-${g.key}`}
              style={[
                styles.optionCard,
                { backgroundColor: goal === g.key ? colors.primary : colors.glass, borderColor: goal === g.key ? colors.primary : colors.glassBorder },
              ]}
              onPress={() => setGoal(g.key)}
            >
              <Text style={styles.optionEmoji}>{g.emoji}</Text>
              <Text style={[styles.optionLabel, { color: goal === g.key ? '#fff' : colors.textPrimary }]}>{g.label}</Text>
              <Text style={[styles.optionDesc, { color: goal === g.key ? 'rgba(255,255,255,0.8)' : colors.textSecondary }]}>{g.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ),
    },
    {
      title: 'Your Fitness Level?',
      subtitle: 'Workouts will adapt to your experience',
      image: HERO_IMAGES[1],
      content: (
        <View style={styles.optionsList}>
          {LEVELS.map(l => (
            <TouchableOpacity
              key={l.key}
              testID={`level-${l.key}`}
              style={[
                styles.listCard,
                { backgroundColor: level === l.key ? colors.primary : colors.glass, borderColor: level === l.key ? colors.primary : colors.glassBorder },
              ]}
              onPress={() => setLevel(l.key)}
            >
              <Text style={styles.optionEmoji}>{l.emoji}</Text>
              <View style={styles.listCardText}>
                <Text style={[styles.optionLabel, { color: level === l.key ? '#fff' : colors.textPrimary }]}>{l.label}</Text>
                <Text style={[styles.optionDesc, { color: level === l.key ? 'rgba(255,255,255,0.8)' : colors.textSecondary }]}>{l.desc}</Text>
              </View>
              {level === l.key && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      ),
    },
    {
      title: 'Where Do You Train?',
      subtitle: 'We\'ll match workouts to your space',
      image: HERO_IMAGES[2],
      content: (
        <View style={styles.optionsGrid}>
          {STYLES.map(s => (
            <TouchableOpacity
              key={s.key}
              testID={`style-${s.key}`}
              style={[
                styles.optionCard,
                { backgroundColor: style === s.key ? colors.primary : colors.glass, borderColor: style === s.key ? colors.primary : colors.glassBorder },
              ]}
              onPress={() => setStyle(s.key)}
            >
              <Text style={styles.optionEmoji}>{s.emoji}</Text>
              <Text style={[styles.optionLabel, { color: style === s.key ? '#fff' : colors.textPrimary }]}>{s.label}</Text>
              <Text style={[styles.optionDesc, { color: style === s.key ? 'rgba(255,255,255,0.8)' : colors.textSecondary }]}>{s.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ),
    },
  ];

  const current = steps[step];

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: current.image }} style={styles.hero}>
        <LinearGradient
          colors={['rgba(15,23,42,0.3)', 'rgba(15,23,42,0.85)', 'rgba(15,23,42,1)']}
          style={styles.gradient}
        />
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={styles.logoMark} />
              <Text style={styles.logoText}>FitAI</Text>
            </View>
            {/* Step indicators */}
            <View style={styles.stepDots}>
              {steps.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    { backgroundColor: i === step ? '#22C55E' : 'rgba(255,255,255,0.3)', width: i === step ? 24 : 8 },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            <Text style={styles.stepLabel}>Step {step + 1} of {steps.length}</Text>
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.subtitle}>{current.subtitle}</Text>

            <View style={styles.optionsContainer}>
              {current.content}
            </View>
          </ScrollView>

          {/* CTA Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              testID="onboarding-next-btn"
              style={styles.ctaBtn}
              onPress={handleNext}
            >
              <LinearGradient
                colors={['#22C55E', '#16A34A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>{step < 2 ? 'Continue →' : "Let's Go! 🚀"}</Text>
              </LinearGradient>
            </TouchableOpacity>
            {step > 0 && (
              <TouchableOpacity
                testID="onboarding-back-btn"
                onPress={() => setStep(step - 1)}
                style={styles.backBtn}
              >
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { flex: 1 },
  gradient: { ...StyleSheet.absoluteFillObject },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#22C55E',
  },
  logoText: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  stepDots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { height: 8, borderRadius: 4 },
  scrollContent: { flex: 1 },
  scrollContainer: { paddingHorizontal: 24, paddingBottom: 16 },
  stepLabel: { fontSize: 12, fontWeight: '700', color: '#22C55E', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8, marginTop: 8 },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 28 },
  optionsContainer: {},
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  optionCard: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  optionEmoji: { fontSize: 32, marginBottom: 8 },
  optionLabel: { fontSize: 15, fontWeight: '700', marginBottom: 4, textAlign: 'center' },
  optionDesc: { fontSize: 12, textAlign: 'center' },
  optionsList: { gap: 12 },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 12,
  },
  listCardText: { flex: 1 },
  checkmark: { fontSize: 18, color: '#fff', fontWeight: '700' },
  footer: { paddingHorizontal: 24, paddingBottom: 16, gap: 12 },
  ctaBtn: { borderRadius: 16, overflow: 'hidden' },
  ctaGradient: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontSize: 17, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  backBtn: { alignItems: 'center', paddingVertical: 8 },
  backText: { fontSize: 15, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
});
