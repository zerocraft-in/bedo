import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ImageBackground, Animated, useColorScheme, Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../../store/useAppStore';
import { Colors } from '../../utils/theme';
import { workoutPlans } from '../../data/mockData';
import { WorkoutCategory, WorkoutPlan } from '../../types';

const CATEGORIES: { key: WorkoutCategory | 'all'; label: string; emoji: string }[] = [
  { key: 'all', label: 'All', emoji: '🏆' },
  { key: 'lifting', label: 'Lifting', emoji: '🏋️' },
  { key: 'running', label: 'Running', emoji: '🏃' },
  { key: 'hiit', label: 'HIIT', emoji: '⚡' },
  { key: 'yoga', label: 'Yoga', emoji: '🧘' },
  { key: 'stretching', label: 'Stretch', emoji: '🤸' },
];

const DIFFICULTY_COLORS = { easy: '#22C55E', medium: '#F59E0B', hard: '#EF4444' };

function WorkoutDetailModal({
  workout,
  visible,
  onClose,
  onStart,
  colors,
  isDark,
}: {
  workout: WorkoutPlan | null;
  visible: boolean;
  onClose: () => void;
  onStart: () => void;
  colors: typeof Colors.dark;
  isDark: boolean;
}) {
  if (!workout) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <View style={[modalStyles.overlay]}>
        <View style={[modalStyles.sheet, { backgroundColor: colors.surface }]}>
          <View style={modalStyles.handle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <ImageBackground
              source={{ uri: workout.imageUrl }}
              style={modalStyles.heroImg}
              imageStyle={{ borderRadius: 20 }}
            >
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={[modalStyles.heroGrad, { borderRadius: 20 }]}>
                <View style={modalStyles.heroBadges}>
                  <View style={[modalStyles.badge, { backgroundColor: DIFFICULTY_COLORS[workout.difficulty] }]}>
                    <Text style={modalStyles.badgeText}>{workout.difficulty.toUpperCase()}</Text>
                  </View>
                  {workout.tags.map(t => (
                    <View key={t} style={[modalStyles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                      <Text style={modalStyles.badgeText}>{t}</Text>
                    </View>
                  ))}
                </View>
                <Text style={modalStyles.heroTitle}>{workout.title}</Text>
                <View style={modalStyles.heroInfo}>
                  <Ionicons name="time-outline" size={14} color="#fff" />
                  <Text style={modalStyles.heroInfoText}>{workout.duration} min</Text>
                  <Ionicons name="flame-outline" size={14} color="#fff" />
                  <Text style={modalStyles.heroInfoText}>{workout.calories} cal</Text>
                  <Ionicons name="barbell-outline" size={14} color="#fff" />
                  <Text style={modalStyles.heroInfoText}>{workout.exercises.length} exercises</Text>
                </View>
              </LinearGradient>
            </ImageBackground>

            <View style={modalStyles.body}>
              <Text style={[modalStyles.desc, { color: colors.textSecondary }]}>{workout.description}</Text>
              <Text style={[modalStyles.exercisesTitle, { color: colors.textPrimary }]}>Exercises</Text>
              {workout.exercises.map((ex, i) => (
                <View key={ex.id} style={[modalStyles.exerciseRow, { borderBottomColor: colors.border }]}>
                  <View style={[modalStyles.exerciseNum, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[modalStyles.exNumText, { color: colors.primary }]}>{i + 1}</Text>
                  </View>
                  <View style={modalStyles.exerciseInfo}>
                    <Text style={[modalStyles.exName, { color: colors.textPrimary }]}>{ex.name}</Text>
                    <Text style={[modalStyles.exMeta, { color: colors.textSecondary }]}>
                      {ex.sets ? `${ex.sets} sets × ` : ''}{ex.reps || (ex.duration ? `${ex.duration}s` : '')} · Rest {ex.restTime}s
                    </Text>
                  </View>
                  <Text style={[modalStyles.muscle, { color: colors.textMuted }]}>{ex.muscleGroup}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
          <View style={modalStyles.footer}>
            <TouchableOpacity testID="close-workout-modal" onPress={onClose} style={[modalStyles.closeBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity testID="start-workout-modal" onPress={onStart} style={modalStyles.startBtn}>
              <LinearGradient colors={['#22C55E', '#16A34A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={modalStyles.startGrad}>
                <Ionicons name="flash" size={18} color="#fff" />
                <Text style={modalStyles.startText}>Start Workout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function WorkoutsScreen() {
  const { themeMode, addWorkoutSession } = useAppStore();
  const systemScheme = useColorScheme();
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');
  const colors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | 'all'>('all');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filtered = selectedCategory === 'all'
    ? workoutPlans
    : workoutPlans.filter(w => w.category === selectedCategory);

  const handleStartWorkout = () => {
    if (!selectedWorkout) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addWorkoutSession({
      id: `s-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      workoutId: selectedWorkout.id,
      workoutTitle: selectedWorkout.title,
      duration: selectedWorkout.duration,
      caloriesBurned: selectedWorkout.calories,
      completed: true,
      category: selectedWorkout.category,
    });
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Sticky Header */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>My Workouts</Text>
          <View style={[styles.countBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.countText, { color: colors.primary }]}>{filtered.length}</Text>
          </View>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.chipsScroll, { borderBottomColor: colors.border }]}
          contentContainerStyle={styles.chipsContent}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              testID={`category-${cat.key}`}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedCategory === cat.key ? colors.primary : colors.surface,
                  borderColor: selectedCategory === cat.key ? colors.primary : colors.border,
                  flexShrink: 0,
                },
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedCategory(cat.key);
              }}
            >
              <Text style={styles.chipEmoji}>{cat.emoji}</Text>
              <Text style={[styles.chipText, { color: selectedCategory === cat.key ? '#fff' : colors.textSecondary }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Workout List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            testID={`workout-card-${item.id}`}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedWorkout(item);
              setModalVisible(true);
            }}
            style={styles.workoutCard}
          >
            <ImageBackground
              source={{ uri: item.imageUrl }}
              style={styles.cardBg}
              imageStyle={{ borderRadius: 20 }}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.75)']}
                style={[styles.cardGrad, { borderRadius: 20 }]}
              >
                <View style={styles.cardTopRow}>
                  <View style={[styles.categoryPill, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
                    <Text style={styles.categoryPillText}>{item.category.toUpperCase()}</Text>
                  </View>
                  <View style={[styles.diffPill, { backgroundColor: DIFFICULTY_COLORS[item.difficulty] }]}>
                    <Text style={styles.diffPillText}>{item.difficulty}</Text>
                  </View>
                </View>
                <View style={styles.cardBottom}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={styles.cardStats}>
                    <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.85)" />
                    <Text style={styles.cardStatText}>{item.duration} min</Text>
                    <Ionicons name="flame-outline" size={13} color="rgba(255,255,255,0.85)" />
                    <Text style={styles.cardStatText}>{item.calories} cal</Text>
                    <Ionicons name="barbell-outline" size={13} color="rgba(255,255,255,0.85)" />
                    <Text style={styles.cardStatText}>{item.exercises.length} ex</Text>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />

      <WorkoutDetailModal
        workout={selectedWorkout}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStart={handleStartWorkout}
        colors={colors}
        isDark={isDark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, gap: 10 },
  screenTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countText: { fontSize: 14, fontWeight: '700' },
  chipsScroll: { borderBottomWidth: 1 },
  chipsContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, gap: 6, height: 36 },
  chipEmoji: { fontSize: 14 },
  chipText: { fontSize: 13, fontWeight: '600' },
  listContent: { padding: 16, gap: 14 },
  workoutCard: { height: 200, borderRadius: 20, overflow: 'hidden' },
  cardBg: { flex: 1 },
  cardGrad: { flex: 1, padding: 14, justifyContent: 'space-between' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  categoryPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryPillText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 0.8 },
  diffPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  diffPillText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  cardBottom: {},
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.3, marginBottom: 6 },
  cardStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardStatText: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '500', marginRight: 6 },
});

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '90%', paddingTop: 8 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#94A3B8', alignSelf: 'center', marginBottom: 16 },
  heroImg: { height: 200, marginHorizontal: 16, marginBottom: 16 },
  heroGrad: { flex: 1, justifyContent: 'flex-end', padding: 16 },
  heroBadges: { flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: -0.3, marginBottom: 8 },
  heroInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroInfoText: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '500', marginRight: 8 },
  body: { paddingHorizontal: 20, paddingBottom: 24 },
  desc: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  exercisesTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
  exerciseNum: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  exNumText: { fontSize: 14, fontWeight: '700' },
  exerciseInfo: { flex: 1 },
  exName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  exMeta: { fontSize: 12 },
  muscle: { fontSize: 11, fontWeight: '600' },
  footer: { flexDirection: 'row', gap: 12, padding: 16, paddingBottom: 24 },
  closeBtn: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  startBtn: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  startGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  startText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
