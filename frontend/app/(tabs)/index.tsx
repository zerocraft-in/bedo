import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, useColorScheme, ImageBackground, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors } from '../../utils/theme';
import ProgressRing from '../../components/ProgressRing';
import WeeklyChart from '../../components/WeeklyChart';
import { getLast7DaysStats, workoutPlans, motivationalMessages } from '../../data/mockData';

export default function HomeScreen() {
  const { user, workoutHistory, themeMode } = useAppStore();
  const systemScheme = useColorScheme();
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');
  const colors = isDark ? Colors.dark : Colors.light;
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [motivationMsg, setMotivationMsg] = useState(motivationalMessages[0]);
  const [loadingMotivation, setLoadingMotivation] = useState(false);

  const weekStats = getLast7DaysStats(workoutHistory);
  const todayStat = weekStats[weekStats.length - 1];
  const todayWorkout = workoutPlans[0];

  const todayCalories = todayStat.calories;
  const calProgress = Math.min(todayCalories / user.caloriesGoal, 1);
  const weekWorkouts = weekStats.filter(s => s.hasWorkout).length;
  const weekProgress = Math.min(weekWorkouts / user.workoutsGoal, 1);
  const activeMinutes = weekStats.reduce((sum, s) => sum + s.minutes, 0);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const fetchMotivation = async () => {
    setLoadingMotivation(true);
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/motivation?user_name=${user.name}&streak=${user.streak}`
      );
      if (res.ok) {
        const data = await res.json();
        setMotivationMsg(data.message);
      }
    } catch {
      setMotivationMsg(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
    } finally {
      setLoadingMotivation(false);
    }
  };

  useEffect(() => {
    fetchMotivation();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMotivation();
    setRefreshing(false);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Sticky Header */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{getGreeting()}</Text>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>{user.name} 👋</Text>
          </View>
          <TouchableOpacity
            testID="streak-badge"
            style={[styles.streakBadge, { backgroundColor: isDark ? '#2D1B00' : '#FFF7ED' }]}
          >
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={[styles.streakNum, { color: '#F59E0B' }]}>{user.streak}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress Rings */}
        <View style={[styles.ringsCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Today's Progress</Text>
          <View style={styles.ringsRow}>
            <View style={styles.ringItem}>
              <ProgressRing
                size={90}
                strokeWidth={10}
                progress={calProgress}
                color={colors.ring1}
                backgroundColor={colors.ringBg}
                value={todayCalories > 0 ? `${todayCalories}` : '0'}
                label="Cal"
              />
            </View>
            <View style={styles.ringItem}>
              <ProgressRing
                size={90}
                strokeWidth={10}
                progress={weekProgress}
                color={colors.ring2}
                backgroundColor={colors.ringBg}
                value={`${weekWorkouts}/${user.workoutsGoal}`}
                label="Week"
              />
            </View>
            <View style={styles.ringItem}>
              <ProgressRing
                size={90}
                strokeWidth={10}
                progress={Math.min(activeMinutes / 300, 1)}
                color={colors.ring3}
                backgroundColor={colors.ringBg}
                value={`${activeMinutes}`}
                label="Min"
              />
            </View>
          </View>
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={[styles.metricValue, { color: colors.primary }]}>{user.streak}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Day Streak</Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
            <View style={styles.metric}>
              <Text style={[styles.metricValue, { color: colors.accent }]}>{user.totalWorkouts}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Workouts</Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
            <View style={styles.metric}>
              <Text style={[styles.metricValue, { color: colors.warning }]}>{user.weight} kg</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Weight</Text>
            </View>
          </View>
        </View>

        {/* AI Coach Card */}
        <TouchableOpacity
          testID="ai-coach-card"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/(tabs)/coach');
          }}
          style={styles.coachCardWrapper}
        >
          <LinearGradient
            colors={isDark ? ['#0D2E1A', '#0F172A'] : ['#DCFCE7', '#FFFFFF']}
            style={[styles.coachCard, { borderColor: colors.primary + '40' }]}
          >
            <View style={styles.coachHeader}>
              <View style={[styles.aiAvatar, { backgroundColor: colors.primary }]}>
                <Ionicons name="sparkles" size={18} color="#fff" />
              </View>
              <View>
                <Text style={[styles.coachName, { color: colors.primary }]}>FitAI Coach</Text>
                <View style={styles.onlineRow}>
                  <View style={styles.onlineDot} />
                  <Text style={[styles.onlineText, { color: colors.textSecondary }]}>Online</Text>
                </View>
              </View>
              {loadingMotivation ? (
                <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 'auto' }} />
              ) : (
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} style={{ marginLeft: 'auto' }} />
              )}
            </View>
            <Text style={[styles.coachMsg, { color: colors.textPrimary }]}>{motivationMsg}</Text>
            <Text style={[styles.coachAction, { color: colors.primary }]}>Tap to chat with your coach →</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Today's Workout */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Today's Workout</Text>
          <TouchableOpacity testID="see-all-workouts" onPress={() => router.push('/(tabs)/workouts')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          testID="today-workout-card"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/(tabs)/workouts');
          }}
          style={styles.workoutCardWrapper}
        >
          <ImageBackground
            source={{ uri: todayWorkout.imageUrl }}
            style={styles.workoutCard}
            imageStyle={{ borderRadius: 24 }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.85)']}
              style={[styles.workoutGradient, { borderRadius: 24 }]}
            >
              <View style={styles.workoutMeta}>
                <View style={styles.workoutBadges}>
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.badgeText}>{todayWorkout.category.toUpperCase()}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Text style={styles.badgeText}>{todayWorkout.difficulty.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.workoutTitle}>{todayWorkout.title}</Text>
                <View style={styles.workoutInfo}>
                  <Ionicons name="time-outline" size={14} color="#fff" />
                  <Text style={styles.workoutInfoText}>{todayWorkout.duration} min</Text>
                  <Ionicons name="flame-outline" size={14} color="#fff" style={{ marginLeft: 8 }} />
                  <Text style={styles.workoutInfoText}>{todayWorkout.calories} cal</Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* Weekly Chart */}
        <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Weekly Activity</Text>
          <WeeklyChart data={weekStats} colors={colors} />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating CTA */}
      <View style={[styles.floatingCta, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          testID="start-workout-btn"
          style={styles.startBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            router.push('/(tabs)/workouts');
          }}
        >
          <LinearGradient
            colors={['#22C55E', '#16A34A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startBtnGradient}
          >
            <Ionicons name="flash" size={20} color="#fff" />
            <Text style={styles.startBtnText}>Start Today's Workout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1 },
  greeting: { fontSize: 13, fontWeight: '500' },
  userName: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3, marginTop: 2 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4 },
  streakFire: { fontSize: 18 },
  streakNum: { fontSize: 18, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  ringsCard: { borderRadius: 24, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 16 },
  ringsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  ringItem: { alignItems: 'center' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12 },
  metric: { alignItems: 'center' },
  metricValue: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  metricLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  metricDivider: { width: 1, height: '100%' },
  coachCardWrapper: { marginBottom: 16 },
  coachCard: { borderRadius: 20, padding: 16, borderWidth: 1 },
  coachHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  aiAvatar: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  coachName: { fontSize: 14, fontWeight: '700' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  onlineText: { fontSize: 11 },
  coachMsg: { fontSize: 14, lineHeight: 20, marginBottom: 10 },
  coachAction: { fontSize: 13, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAll: { fontSize: 14, fontWeight: '600' },
  workoutCardWrapper: { marginBottom: 16 },
  workoutCard: { height: 200, borderRadius: 24, overflow: 'hidden' },
  workoutGradient: { flex: 1, justifyContent: 'flex-end', padding: 16 },
  workoutMeta: {},
  workoutBadges: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  workoutTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 6, letterSpacing: -0.3 },
  workoutInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  workoutInfoText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500', marginRight: 4 },
  chartCard: { borderRadius: 24, padding: 16, marginBottom: 16 },
  floatingCta: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  startBtn: { borderRadius: 16, overflow: 'hidden' },
  startBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  startBtnText: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
});
