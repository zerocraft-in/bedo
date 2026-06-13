import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { Colors } from '../../utils/theme';
import { getLast7DaysStats, achievements, challenges } from '../../data/mockData';
import WeeklyChart from '../../components/WeeklyChart';

function StatCard({ value, label, icon, color, colors }: {
  value: string; label: string; icon: string; color: string; colors: typeof Colors.dark;
}) {
  return (
    <View style={[statStyles.card, { backgroundColor: colors.surface }]}>
      <View style={[statStyles.iconBox, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <Text style={[statStyles.value, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[statStyles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

function ChallengeCard({ challenge, colors }: { challenge: typeof challenges[0]; colors: typeof Colors.dark }) {
  const progress = Math.min(challenge.current / challenge.target, 1);
  const pct = Math.round(progress * 100);
  return (
    <View style={[challStyles.card, { backgroundColor: colors.surface }]}>
      <View style={challStyles.header}>
        <Text style={challStyles.emoji}>{challenge.emoji}</Text>
        <View style={challStyles.info}>
          <Text style={[challStyles.title, { color: colors.textPrimary }]}>{challenge.title}</Text>
          <Text style={[challStyles.desc, { color: colors.textSecondary }]}>{challenge.description}</Text>
        </View>
        <View style={[challStyles.typeBadge, {
          backgroundColor: challenge.type === 'daily' ? colors.primary + '20' : colors.accent + '20',
        }]}>
          <Text style={[challStyles.typeTxt, { color: challenge.type === 'daily' ? colors.primary : colors.accent }]}>
            {challenge.type}
          </Text>
        </View>
      </View>
      <View style={challStyles.progressRow}>
        <View style={[challStyles.progressBg, { backgroundColor: colors.border }]}>
          <View
            style={[challStyles.progressFill, {
              width: `${pct}%`,
              backgroundColor: challenge.completed ? colors.primary : (challenge.type === 'daily' ? colors.primary : colors.accent),
            }]}
          />
        </View>
        <Text style={[challStyles.pctText, { color: colors.textSecondary }]}>
          {challenge.current.toLocaleString()}/{challenge.target.toLocaleString()} {challenge.unit} · {pct}%
        </Text>
      </View>
      {challenge.completed && (
        <View style={[challStyles.completedBadge, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
          <Text style={[challStyles.completedText, { color: colors.primary }]}>Completed! +{challenge.reward}</Text>
        </View>
      )}
    </View>
  );
}

export default function ProgressScreen() {
  const { user, workoutHistory, themeMode } = useAppStore();
  const systemScheme = useColorScheme();
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');
  const colors = isDark ? Colors.dark : Colors.light;

  const [activeTab, setActiveTab] = useState<'stats' | 'challenges' | 'badges'>('stats');
  const weekStats = getLast7DaysStats(workoutHistory);
  const totalCalories = workoutHistory.reduce((s, w) => s + w.caloriesBurned, 0);
  const totalMinutes = workoutHistory.reduce((s, w) => s + w.duration, 0);
  const weekCal = weekStats.reduce((s, d) => s + d.calories, 0);

  const TABS = [
    { key: 'stats', label: 'Stats' },
    { key: 'challenges', label: 'Challenges' },
    { key: 'badges', label: 'Badges' },
  ] as const;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Progress</Text>
          <View style={[styles.levelBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.levelText, { color: colors.primary }]}>{user.fitnessLevel}</Text>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              testID={`progress-tab-${tab.key}`}
              style={[styles.tab, activeTab === tab.key && { borderBottomColor: colors.primary, borderBottomWidth: 2.5 }]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, { color: activeTab === tab.key ? colors.primary : colors.textSecondary, fontWeight: activeTab === tab.key ? '700' : '400' }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {activeTab === 'stats' && (
          <>
            {/* Weekly Chart */}
            <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Weekly Calories</Text>
              <WeeklyChart data={weekStats} colors={colors} height={130} />
            </View>

            {/* Stat Cards */}
            <View style={styles.statsGrid}>
              <StatCard value={`${user.streak}`} label="Day Streak" icon="flame" color="#F59E0B" colors={colors} />
              <StatCard value={`${user.totalWorkouts}`} label="Total Workouts" icon="barbell" color={colors.primary} colors={colors} />
              <StatCard value={`${(totalCalories / 1000).toFixed(1)}k`} label="Total Cal Burned" icon="flash" color={colors.accent} colors={colors} />
              <StatCard value={`${Math.round(totalMinutes / 60)}h`} label="Active Time" icon="time" color="#8B5CF6" colors={colors} />
              <StatCard value={`${weekCal}`} label="Cal This Week" icon="today" color="#EC4899" colors={colors} />
              <StatCard value={`${user.weight} kg`} label="Current Weight" icon="scale" color="#14B8A6" colors={colors} />
            </View>

            {/* Goal progress */}
            <View style={[styles.goalCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Goal Progress</Text>
              <View style={styles.goalRow}>
                <Text style={[styles.goalLabel, { color: colors.textSecondary }]}>Weight Goal</Text>
                <Text style={[styles.goalValue, { color: colors.textPrimary }]}>{user.weight} → {user.targetWeight} kg</Text>
              </View>
              <View style={[styles.goalBar, { backgroundColor: colors.border }]}>
                <View style={[styles.goalFill, {
                  width: `${Math.min(((user.weight - user.targetWeight) / (75 - user.targetWeight)) * 100, 100)}%`,
                  backgroundColor: colors.primary
                }]} />
              </View>
            </View>
          </>
        )}

        {activeTab === 'challenges' && (
          <View style={styles.challengesList}>
            {challenges.map(c => <ChallengeCard key={c.id} challenge={c} colors={colors} />)}
          </View>
        )}

        {activeTab === 'badges' && (
          <View style={styles.badgesGrid}>
            {achievements.map(a => (
              <View
                key={a.id}
                testID={`badge-${a.id}`}
                style={[
                  styles.badge,
                  {
                    backgroundColor: a.unlocked ? colors.surface : colors.surfaceAlt,
                    borderColor: a.unlocked ? colors.primary + '40' : colors.border,
                    opacity: a.unlocked ? 1 : 0.6,
                  },
                ]}
              >
                <Text style={[styles.badgeEmoji, { opacity: a.unlocked ? 1 : 0.4 }]}>{a.emoji}</Text>
                <Text style={[styles.badgeTitle, { color: colors.textPrimary }]}>{a.title}</Text>
                <Text style={[styles.badgeDesc, { color: colors.textSecondary }]}>{a.description}</Text>
                {a.unlocked ? (
                  <View style={[styles.unlockedTag, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                    <Text style={[styles.unlockedText, { color: colors.primary }]}>Earned</Text>
                  </View>
                ) : (
                  <View style={[styles.lockedTag, { backgroundColor: colors.border }]}>
                    <Ionicons name="lock-closed" size={12} color={colors.textMuted} />
                    <Text style={[styles.lockedText, { color: colors.textMuted }]}>{a.requirement}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  levelBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  levelText: { fontSize: 13, fontWeight: '700', textTransform: 'capitalize' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabText: { fontSize: 14 },
  content: { padding: 16, gap: 16 },
  chartCard: { borderRadius: 24, padding: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  goalCard: { borderRadius: 24, padding: 16 },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  goalLabel: { fontSize: 14 },
  goalValue: { fontSize: 14, fontWeight: '600' },
  goalBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  goalFill: { height: '100%', borderRadius: 4 },
  challengesList: { gap: 12 },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badge: { width: '47%', padding: 16, borderRadius: 20, alignItems: 'center', borderWidth: 1, gap: 6 },
  badgeEmoji: { fontSize: 36, marginBottom: 4 },
  badgeTitle: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  badgeDesc: { fontSize: 12, textAlign: 'center', lineHeight: 16 },
  unlockedTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  unlockedText: { fontSize: 11, fontWeight: '700' },
  lockedTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  lockedText: { fontSize: 11 },
});

const statStyles = StyleSheet.create({
  card: { width: '47%', padding: 16, borderRadius: 20, gap: 8 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  label: { fontSize: 12, fontWeight: '500' },
});

const challStyles = StyleSheet.create({
  card: { borderRadius: 20, padding: 16, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  emoji: { fontSize: 28 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  desc: { fontSize: 13, lineHeight: 18 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  typeTxt: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  progressRow: { gap: 6 },
  progressBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  pctText: { fontSize: 12 },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, alignSelf: 'flex-start' },
  completedText: { fontSize: 12, fontWeight: '700' },
});
