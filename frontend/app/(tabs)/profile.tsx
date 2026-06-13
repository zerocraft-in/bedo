import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Switch, useColorScheme, Alert, Modal, TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Colors } from '../../utils/theme';
import { ThemeMode } from '../../types';

const TABS = ['General', 'Settings', 'Devices'] as const;
type Tab = typeof TABS[number];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SettingRow({ icon, iconColor, label, value, onPress, colors, showArrow = true, danger = false }: {
  icon: string; iconColor?: string; label: string; value?: string; onPress?: () => void;
  colors: typeof Colors.dark; showArrow?: boolean; danger?: boolean;
}) {
  const ic = iconColor || colors.primary;
  return (
    <TouchableOpacity
      testID={`setting-${label.toLowerCase().replace(/\s+/g, '-')}`}
      style={[row.rowItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.6}
    >
      <View style={[row.iconBox, { backgroundColor: ic + '18' }]}>
        <Ionicons name={icon as any} size={18} color={ic} />
      </View>
      <Text style={[row.label, { color: danger ? colors.danger : colors.textPrimary }]}>{label}</Text>
      {value && <Text style={[row.value, { color: colors.textSecondary }]} numberOfLines={1}>{value}</Text>}
      {showArrow && <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />}
    </TouchableOpacity>
  );
}

function SwitchRow({ icon, iconColor, label, value, onToggle, colors }: {
  icon: string; iconColor?: string; label: string; value: boolean; onToggle: () => void; colors: typeof Colors.dark;
}) {
  const ic = iconColor || colors.accent;
  return (
    <View style={[row.rowItem, { borderBottomColor: colors.border }]}>
      <View style={[row.iconBox, { backgroundColor: ic + '18' }]}>
        <Ionicons name={icon as any} size={18} color={ic} />
      </View>
      <Text style={[row.label, { color: colors.textPrimary }]}>{label}</Text>
      <Switch
        testID={`toggle-${label.toLowerCase().replace(/\s+/g, '-')}`}
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );
}

// ─── Edit Profile Modal ───────────────────────────────────────────────────────

function EditProfileModal({ visible, onClose, colors }: {
  visible: boolean; onClose: () => void; colors: typeof Colors.dark;
}) {
  const { authUser, updateProfile } = useAuthStore();
  const [name, setName] = useState(authUser?.name || '');
  const [email, setEmail] = useState(authUser?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!name.trim() || name.trim().length < 2) { setError('Name must be at least 2 characters'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email'); return; }
    setIsLoading(true); setError('');
    const result = await updateProfile({ name: name.trim(), email: email.trim() });
    setIsLoading(false);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <View style={modal.overlay}>
        <View style={[modal.sheet, { backgroundColor: colors.surface }]}>
          <View style={modal.handle} />
          <Text style={[modal.title, { color: colors.textPrimary }]}>Edit Profile</Text>
          {error ? (
            <View style={[modal.errorBox, { backgroundColor: '#FEF2F2' }]}>
              <Text style={{ color: '#EF4444', fontSize: 13 }}>{error}</Text>
            </View>
          ) : null}
          <View style={modal.fields}>
            <View style={modal.fieldGroup}>
              <Text style={[modal.label, { color: colors.textSecondary }]}>Full name</Text>
              <TextInput
                style={[modal.input, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
                value={name}
                onChangeText={t => { setName(t); setError(''); }}
                autoCapitalize="words"
              />
            </View>
            <View style={modal.fieldGroup}>
              <Text style={[modal.label, { color: colors.textSecondary }]}>Email</Text>
              <TextInput
                style={[modal.input, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
                value={email}
                onChangeText={t => { setEmail(t); setError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
          <View style={modal.actions}>
            <TouchableOpacity style={[modal.cancelBtn, { borderColor: colors.border }]} onPress={onClose}>
              <Text style={[modal.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[modal.saveBtn, isLoading && { opacity: 0.7 }]} onPress={handleSave} disabled={isLoading}>
              <LinearGradient colors={['#22C55E', '#16A34A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={modal.saveGrad}>
                {isLoading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={modal.saveText}>Save changes</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Profile Screen ──────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { user, themeMode, setThemeMode } = useAppStore();
  const { authUser, logout, deleteAccount, loginDevices, removeDevice } = useAuthStore();
  const systemScheme = useColorScheme();
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');
  const colors = isDark ? Colors.dark : Colors.light;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('General');
  const [notifications, setNotifications] = useState(true);
  const [workoutReminder, setWorkoutReminder] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const displayName = authUser?.name || user.name;
  const displayEmail = authUser?.email || 'Not signed in';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const memberDays = authUser
    ? Math.round((Date.now() - new Date(authUser.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : Math.round((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24));

  const handleLogout = () => {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Are you absolutely sure?', 'Type "DELETE" to confirm.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Yes, delete my account',
                style: 'destructive',
                onPress: async () => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                  await deleteAccount();
                  router.replace('/auth/login');
                },
              },
            ]);
          },
        },
      ]
    );
  };

  const handleRemoveDevice = (deviceId: string, deviceName: string) => {
    Alert.alert('Remove Device', `Sign out from "${deviceName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          removeDevice(deviceId);
        },
      },
    ]);
  };

  const handleResetOnboarding = async () => {
    Alert.alert('Restart Onboarding', 'This will take you through the setup again.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Restart',
        onPress: async () => {
          await AsyncStorage.multiRemove(['hasCompletedOnboarding', 'user', 'chatMessages']);
          router.replace('/onboarding');
        },
      },
    ]);
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
        <View style={[s.header, { borderBottomColor: colors.border }]}>
          <Text style={[s.title, { color: colors.textPrimary }]}>Profile</Text>
          <TouchableOpacity
            testID="theme-toggle-btn"
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setThemeMode(isDark ? 'light' : 'dark'); }}
            style={[s.themeBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Avatar card */}
      <View style={[s.avatarCard, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <LinearGradient
          colors={isDark ? ['#0F172A', '#1E293B'] : ['#F0FDF4', '#FFFFFF']}
          style={s.avatarBg}
        >
          <View style={s.avatarRow}>
            <View style={[s.avatar, { backgroundColor: colors.primary }]}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
            <View style={s.avatarInfo}>
              <Text style={[s.userName, { color: colors.textPrimary }]}>{displayName}</Text>
              <Text style={[s.userEmail, { color: colors.textSecondary }]} numberOfLines={1}>{displayEmail}</Text>
              <View style={[s.planBadge, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="flash" size={11} color={colors.primary} />
                <Text style={[s.planText, { color: colors.primary }]}>FitAI Pro</Text>
              </View>
            </View>
            <TouchableOpacity
              testID="edit-profile-btn"
              onPress={() => setEditModalVisible(true)}
              style={[s.editBtn, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}
            >
              <Ionicons name="pencil-outline" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={[s.statsRow, { borderTopColor: colors.border }]}>
            <View style={s.statItem}>
              <Text style={[s.statValue, { color: colors.primary }]}>{user.streak}</Text>
              <Text style={[s.statLabel, { color: colors.textSecondary }]}>🔥 Streak</Text>
            </View>
            <View style={[s.statDivider, { backgroundColor: colors.border }]} />
            <View style={s.statItem}>
              <Text style={[s.statValue, { color: colors.accent }]}>{user.totalWorkouts}</Text>
              <Text style={[s.statLabel, { color: colors.textSecondary }]}>Workouts</Text>
            </View>
            <View style={[s.statDivider, { backgroundColor: colors.border }]} />
            <View style={s.statItem}>
              <Text style={[s.statValue, { color: colors.warning }]}>{memberDays}</Text>
              <Text style={[s.statLabel, { color: colors.textSecondary }]}>Days Active</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Tab bar */}
      <View style={[s.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            testID={`profile-tab-${tab.toLowerCase()}`}
            style={[s.tab, activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2.5 }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[s.tabText, { color: activeTab === tab ? colors.primary : colors.textSecondary, fontWeight: activeTab === tab ? '700' : '400' }]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* ─── GENERAL TAB ─── */}
        {activeTab === 'General' && (
          <>
            <View style={[s.section, { backgroundColor: colors.surface }]}>
              <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>ACCOUNT</Text>
              <SettingRow icon="person-circle-outline" label="Edit Profile" onPress={() => setEditModalVisible(true)} colors={colors} />
              <SettingRow icon="scale-outline" label="Current Weight" value={`${user.weight} kg`} colors={colors} showArrow={false} />
              <SettingRow icon="trending-down-outline" label="Target Weight" value={`${user.targetWeight} kg`} colors={colors} showArrow={false} />
              <SettingRow icon="fitness-outline" label="Fitness Level" value={user.fitnessLevel} colors={colors} showArrow={false} />
              <SettingRow icon="calendar-outline" label="Member since" value={authUser ? new Date(authUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'} colors={colors} showArrow={false} />
            </View>

            <View style={[s.section, { backgroundColor: colors.surface }]}>
              <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>SUPPORT</Text>
              <SettingRow icon="information-circle-outline" label="App Version" value="1.0.0" colors={colors} showArrow={false} />
              <SettingRow icon="shield-checkmark-outline" label="Privacy Policy" colors={colors} />
              <SettingRow icon="document-text-outline" label="Terms of Service" colors={colors} />
              <SettingRow icon="chatbubble-outline" label="Contact Support" colors={colors} />
            </View>

            <TouchableOpacity
              testID="logout-button"
              style={[s.actionBtn, { borderColor: '#F59E0B40', backgroundColor: '#F59E0B10' }]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={18} color="#F59E0B" />
              <Text style={[s.actionBtnText, { color: '#F59E0B' }]}>Sign out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="delete-account-btn"
              style={[s.actionBtn, { borderColor: colors.danger + '40', backgroundColor: colors.danger + '10' }]}
              onPress={handleDeleteAccount}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
              <Text style={[s.actionBtnText, { color: colors.danger }]}>Delete account</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ─── SETTINGS TAB ─── */}
        {activeTab === 'Settings' && (
          <>
            <View style={[s.section, { backgroundColor: colors.surface }]}>
              <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
              <SwitchRow icon="moon-outline" label="Dark Mode" value={isDark} onToggle={() => { Haptics.selectionAsync(); setThemeMode(isDark ? 'light' : 'dark'); }} colors={colors} iconColor={colors.accent} />
            </View>

            <View style={[s.section, { backgroundColor: colors.surface }]}>
              <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>NOTIFICATIONS</Text>
              <SwitchRow icon="notifications-outline" label="Push Notifications" value={notifications} onToggle={() => { Haptics.selectionAsync(); setNotifications(!notifications); }} colors={colors} />
              <SwitchRow icon="alarm-outline" label="Workout Reminder" value={workoutReminder} onToggle={() => { Haptics.selectionAsync(); setWorkoutReminder(!workoutReminder); }} colors={colors} />
              <SwitchRow icon="bar-chart-outline" label="Weekly Summary" value={analyticsEnabled} onToggle={() => { Haptics.selectionAsync(); setAnalyticsEnabled(!analyticsEnabled); }} colors={colors} />
            </View>

            <View style={[s.section, { backgroundColor: colors.surface }]}>
              <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>DATA</Text>
              <SettingRow icon="download-outline" label="Export My Data" colors={colors} />
              <SettingRow icon="refresh-outline" label="Restart Onboarding" onPress={handleResetOnboarding} colors={colors} />
              <SwitchRow icon="analytics-outline" label="Share Analytics" value={false} onToggle={() => Haptics.selectionAsync()} colors={colors} iconColor={colors.accent} />
            </View>
          </>
        )}

        {/* ─── DEVICES TAB ─── */}
        {activeTab === 'Devices' && (
          <>
            <View style={[s.infoBox, { backgroundColor: colors.accent + '15', borderColor: colors.accent + '30' }]}>
              <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
              <Text style={[s.infoText, { color: colors.accent }]}>
                These devices have recently accessed your account.
              </Text>
            </View>

            <View style={[s.section, { backgroundColor: colors.surface }]}>
              <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>RECENT LOGINS</Text>
              {loginDevices.map(device => (
                <View key={device.id} style={[s.deviceRow, { borderBottomColor: colors.border }]}>
                  <View style={[s.deviceIcon, { backgroundColor: device.isCurrent ? colors.primary + '20' : colors.surfaceAlt }]}>
                    <Ionicons name={device.icon as any} size={20} color={device.isCurrent ? colors.primary : colors.textSecondary} />
                  </View>
                  <View style={s.deviceInfo}>
                    <View style={s.deviceNameRow}>
                      <Text style={[s.deviceName, { color: colors.textPrimary }]}>{device.name}</Text>
                      {device.isCurrent && (
                        <View style={[s.currentBadge, { backgroundColor: colors.primary + '20' }]}>
                          <Text style={[s.currentText, { color: colors.primary }]}>This device</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[s.deviceMeta, { color: colors.textSecondary }]}>
                      {device.platform} · {device.location}
                    </Text>
                    <Text style={[s.deviceTime, { color: colors.textMuted }]}>
                      {new Date(device.loginAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  {!device.isCurrent && (
                    <TouchableOpacity
                      testID={`remove-device-${device.id}`}
                      onPress={() => handleRemoveDevice(device.id, device.name)}
                      style={[s.removeBtn, { backgroundColor: colors.danger + '15' }]}
                    >
                      <Ionicons name="close" size={14} color={colors.danger} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            <TouchableOpacity
              testID="sign-out-all-devices-btn"
              style={[s.actionBtn, { borderColor: colors.danger + '40', backgroundColor: colors.danger + '10' }]}
              onPress={() => {
                Alert.alert('Sign out all devices', 'This will sign you out from all other devices.', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Sign out all',
                    style: 'destructive',
                    onPress: () => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                      // Remove all non-current devices
                      loginDevices.filter(d => !d.isCurrent).forEach(d => removeDevice(d.id));
                    },
                  },
                ]);
              }}
            >
              <Ionicons name="log-out-outline" size={18} color={colors.danger} />
              <Text style={[s.actionBtnText, { color: colors.danger }]}>Sign out all other devices</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        colors={colors}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  themeBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  avatarCard: { borderBottomWidth: 1 },
  avatarBg: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 0 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  avatar: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  avatarInfo: { flex: 1 },
  userName: { fontSize: 19, fontWeight: '800', letterSpacing: -0.3 },
  userEmail: { fontSize: 13, marginTop: 2, marginBottom: 6 },
  planBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start' },
  planText: { fontSize: 11, fontWeight: '700' },
  editBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  statsRow: { flexDirection: 'row', paddingVertical: 14, borderTopWidth: 1 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  statLabel: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  statDivider: { width: 1, marginHorizontal: 8 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 13 },
  tabText: { fontSize: 14 },
  content: { padding: 16, gap: 16 },
  section: { borderRadius: 20, overflow: 'hidden' },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 16, borderWidth: 1 },
  actionBtnText: { fontSize: 15, fontWeight: '600' },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 14, borderRadius: 14, borderWidth: 1 },
  infoText: { fontSize: 13, flex: 1, lineHeight: 18 },
  deviceRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12, borderBottomWidth: 1 },
  deviceIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  deviceInfo: { flex: 1, gap: 2 },
  deviceNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deviceName: { fontSize: 15, fontWeight: '600' },
  currentBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  currentText: { fontSize: 10, fontWeight: '700' },
  deviceMeta: { fontSize: 12 },
  deviceTime: { fontSize: 11 },
  removeBtn: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});

const row = StyleSheet.create({
  rowItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14, borderBottomWidth: 1 },
  iconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: 15, fontWeight: '500' },
  value: { fontSize: 14, maxWidth: 140 },
});

const modal = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#94A3B8', alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 16 },
  errorBox: { padding: 12, borderRadius: 10, marginBottom: 12 },
  fields: { gap: 16, marginBottom: 24 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600' },
  input: { borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  actions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  cancelText: { fontSize: 15, fontWeight: '600' },
  saveBtn: { flex: 2, borderRadius: 12, overflow: 'hidden' },
  saveGrad: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  saveText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});