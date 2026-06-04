import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Switch, useColorScheme, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Colors } from '../../utils/theme';
import { ThemeMode, Goal, FitnessLevel } from '../../types';

const GOAL_LABELS: Record<Goal, string> = {
  lose_weight: 'Lose Weight',
  build_muscle: 'Build Muscle',
  improve_endurance: 'Endurance',
  stay_active: 'Stay Active',
};

const LEVEL_LABELS: Record<FitnessLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

function SettingRow({ icon, label, value, onPress, colors, showArrow = true }: {
  icon: string; label: string; value?: string; onPress?: () => void;
  colors: typeof Colors.dark; showArrow?: boolean;
}) {
  return (
    <TouchableOpacity
      testID={`setting-${label.toLowerCase().replace(/\s/g, '-')}`}
      style={[rowStyles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[rowStyles.iconBox, { backgroundColor: colors.primary + '15' }]}>
        <Ionicons name={icon as any} size={18} color={colors.primary} />
      </View>
      <Text style={[rowStyles.label, { color: colors.textPrimary }]}>{label}</Text>
      {value && <Text style={[rowStyles.value, { color: colors.textSecondary }]}>{value}</Text>}
      {showArrow && <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />}
    </TouchableOpacity>
  );
}

function SwitchRow({ icon, label, value, onToggle, colors }: {
  icon: string; label: string; value: boolean; onToggle: () => void; colors: typeof Colors.dark;
}) {
  return (
    <View style={[rowStyles.row, { borderBottomColor: colors.border }]}>
      <View style={[rowStyles.iconBox, { backgroundColor: colors.accent + '15' }]}>
        <Ionicons name={icon as any} size={18} color={colors.accent} />
      </View>
      <Text style={[rowStyles.label, { color: colors.textPrimary }]}>{label}</Text>
      <Switch
        testID={`toggle-${label.toLowerCase().replace(/\s/g, '-')}`}
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );
}

export default function ProfileScreen() {
  const { user, themeMode, setThemeMode } = useAppStore();
  const systemScheme = useColorScheme();
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');
  const colors = isDark ? Colors.dark : Colors.light;
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [workoutReminder, setWorkoutReminder] = useState(true);

  const toggleTheme = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setThemeMode(isDark ? 'light' : 'dark');
  };

  const handleResetOnboarding = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await AsyncStorage.multiRemove(['hasCompletedOnboarding', 'user', 'chatMessages']);
    router.replace('/onboarding');
  };

  const totalCalBurned = Math.round(user.totalWorkouts * 320);
  const memberDays = Math.round((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Profile</Text>
          <TouchableOpacity testID="theme-toggle-btn" onPress={toggleTheme} style={[styles.themeBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Avatar Card */}
        <View style={[styles.avatarCard, { backgroundColor: colors.surface }]}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.avatarInfo}>
              <Text style={[styles.userName, { color: colors.textPrimary }]}>{user.name}</Text>
              <Text style={[styles.userGoal, { color: colors.primary }]}>{GOAL_LABELS[user.goal]}</Text>
              <Text style={[styles.userLevel, { color: colors.textSecondary }]}>
                {LEVEL_LABELS[user.fitnessLevel]} · {user.workoutStyle} training
              </Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{user.streak}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>🔥 Streak</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.accent }]}>{user.totalWorkouts}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Workouts</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.warning }]}>{memberDays}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Days Active</Text>
            </View>
          </View>
        </View>

        {/* Body Stats */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>BODY STATS</Text>
          <SettingRow icon="scale-outline" label="Current Weight" value={`${user.weight} kg`} colors={colors} showArrow={false} />
          <SettingRow icon="trending-down-outline" label="Target Weight" value={`${user.targetWeight} kg`} colors={colors} showArrow={false} />
          <SettingRow icon="fitness-outline" label="Fitness Level" value={LEVEL_LABELS[user.fitnessLevel]} colors={colors} showArrow={false} />
        </View>

        {/* Appearance */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
          <SwitchRow icon="moon-outline" label="Dark Mode" value={isDark} onToggle={toggleTheme} colors={colors} />
        </View>

        {/* Notifications */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>NOTIFICATIONS</Text>
          <SwitchRow icon="notifications-outline" label="Push Notifications" value={notifications} onToggle={() => { Haptics.selectionAsync(); setNotifications(!notifications); }} colors={colors} />
          <SwitchRow icon="alarm-outline" label="Workout Reminder" value={workoutReminder} onToggle={() => { Haptics.selectionAsync(); setWorkoutReminder(!workoutReminder); }} colors={colors} />
        </View>

        {/* About */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>
          <SettingRow icon="information-circle-outline" label="App Version" value="1.0.0" colors={colors} showArrow={false} />
          <SettingRow icon="shield-checkmark-outline" label="Privacy Policy" colors={colors} />
          <SettingRow icon="document-text-outline" label="Terms of Service" colors={colors} />
        </View>

        {/* Reset Onboarding */}
        <TouchableOpacity
          testID="restart-onboarding-btn"
          style={[styles.dangerBtn, { borderColor: colors.danger + '50', backgroundColor: colors.danger + '10' }]}
          onPress={handleResetOnboarding}
        >
          <Ionicons name="refresh-outline" size={18} color={colors.danger} />
          <Text style={[styles.dangerText, { color: colors.danger }]}>Restart Onboarding</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  themeBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  content: { padding: 16, gap: 16 },
  avatarCard: { borderRadius: 24, padding: 16 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  avatar: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 28, fontWeight: '800', color: '#fff' },
  avatarInfo: { flex: 1 },
  userName: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3, marginBottom: 4 },
  userGoal: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  userLevel: { fontSize: 13 },
  statsRow: { flexDirection: 'row', paddingTop: 16, borderTopWidth: 1 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  statLabel: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  statDivider: { width: 1, marginHorizontal: 8 },
  section: { borderRadius: 20, overflow: 'hidden' },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  dangerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 16, borderWidth: 1 },
  dangerText: { fontSize: 15, fontWeight: '600' },
});

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14, borderBottomWidth: 1 },
  iconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: 15, fontWeight: '500' },
  value: { fontSize: 14 },
});
