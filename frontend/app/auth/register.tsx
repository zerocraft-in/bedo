import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
  useColorScheme, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../../store/useAuthStore';
import { Colors } from '../../utils/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { registerWithOtp } = useAuthStore();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Colors.dark : Colors.light;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLoading(true);
    setErrors({});
    try {
      const result = await registerWithOtp(name.trim(), email.trim(), password);
      if (result.success) {
        Alert.alert('Verify Email', result.message, [
          { text: 'Enter OTP', onPress: () => router.push('/auth/otp') },
        ]);
      } else {
        setErrors({ general: result.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (field: string) => setErrors(prev => { const n = { ...prev }; delete n[field]; delete n.general; return n; });

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={s.safe} edges={['top']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.flex}>
          <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Back */}
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
              <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
            </TouchableOpacity>

            {/* Header */}
            <View style={s.header}>
              <View style={[s.logoMark, { backgroundColor: colors.primary }]}>
                <Ionicons name="person-add-outline" size={24} color="#fff" />
              </View>
              <Text style={[s.title, { color: colors.textPrimary }]}>Create account</Text>
              <Text style={[s.subtitle, { color: colors.textSecondary }]}>
                Start your fitness journey today
              </Text>
            </View>

            <View style={s.form}>
              {errors.general && (
                <View style={[s.errorBanner, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
                  <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
                  <Text style={[s.errorBannerText, { color: '#EF4444' }]}>{errors.general}</Text>
                </View>
              )}

              {/* Name */}
              <View style={s.fieldGroup}>
                <Text style={[s.label, { color: colors.textSecondary }]}>Full name</Text>
                <View style={[s.inputWrap, { backgroundColor: colors.surface, borderColor: errors.name ? '#EF4444' : colors.border }]}>
                  <Ionicons name="person-outline" size={18} color={colors.textMuted} style={s.inputIcon} />
                  <TextInput
                    testID="register-name-input"
                    style={[s.input, { color: colors.textPrimary }]}
                    placeholder="Your full name"
                    placeholderTextColor={colors.textMuted}
                    value={name}
                    onChangeText={t => { setName(t); clearError('name'); }}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
                {errors.name && <Text style={s.fieldError}>{errors.name}</Text>}
              </View>

              {/* Email */}
              <View style={s.fieldGroup}>
                <Text style={[s.label, { color: colors.textSecondary }]}>Email address</Text>
                <View style={[s.inputWrap, { backgroundColor: colors.surface, borderColor: errors.email ? '#EF4444' : colors.border }]}>
                  <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={s.inputIcon} />
                  <TextInput
                    testID="register-email-input"
                    style={[s.input, { color: colors.textPrimary }]}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.textMuted}
                    value={email}
                    onChangeText={t => { setEmail(t); clearError('email'); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>
                {errors.email && <Text style={s.fieldError}>{errors.email}</Text>}
              </View>

              {/* Password */}
              <View style={s.fieldGroup}>
                <Text style={[s.label, { color: colors.textSecondary }]}>Password</Text>
                <View style={[s.inputWrap, { backgroundColor: colors.surface, borderColor: errors.password ? '#EF4444' : colors.border }]}>
                  <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={s.inputIcon} />
                  <TextInput
                    testID="register-password-input"
                    style={[s.input, { color: colors.textPrimary }]}
                    placeholder="Min. 6 characters"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={t => { setPassword(t); clearError('password'); }}
                    secureTextEntry={!showPassword}
                    returnKeyType="next"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeBtn}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={s.fieldError}>{errors.password}</Text>}
              </View>

              {/* Confirm Password */}
              <View style={s.fieldGroup}>
                <Text style={[s.label, { color: colors.textSecondary }]}>Confirm password</Text>
                <View style={[s.inputWrap, { backgroundColor: colors.surface, borderColor: errors.confirmPassword ? '#EF4444' : colors.border }]}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={colors.textMuted} style={s.inputIcon} />
                  <TextInput
                    testID="register-password-confirm-input"
                    style={[s.input, { color: colors.textPrimary }]}
                    placeholder="Repeat password"
                    placeholderTextColor={colors.textMuted}
                    value={confirmPassword}
                    onChangeText={t => { setConfirmPassword(t); clearError('confirmPassword'); }}
                    secureTextEntry={!showConfirm}
                    returnKeyType="done"
                    onSubmitEditing={handleRegister}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={s.eyeBtn}>
                    <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={s.fieldError}>{errors.confirmPassword}</Text>}
              </View>

              {/* Password strength indicator */}
              {password.length > 0 && (
                <View style={s.strengthRow}>
                  {[1, 2, 3, 4].map(i => (
                    <View
                      key={i}
                      style={[
                        s.strengthBar,
                        {
                          backgroundColor:
                            password.length >= i * 3
                              ? password.length >= 10 ? '#22C55E' : password.length >= 7 ? '#F59E0B' : '#EF4444'
                              : colors.border,
                        },
                      ]}
                    />
                  ))}
                  <Text style={[s.strengthLabel, { color: colors.textMuted }]}>
                    {password.length < 4 ? 'Weak' : password.length < 7 ? 'Fair' : password.length < 10 ? 'Good' : 'Strong'}
                  </Text>
                </View>
              )}

              {/* CTA */}
              <TouchableOpacity
                testID="register-submit-button"
                style={[s.ctaBtn, isLoading && s.ctaBtnDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#22C55E', '#16A34A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={s.ctaGrad}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="mail-outline" size={18} color="#fff" />
                      <Text style={s.ctaText}>Send verification OTP</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <Text style={[s.terms, { color: colors.textMuted }]}>
                By creating an account, you agree to our{' '}
                <Text style={{ color: colors.primary }}>Terms</Text> and{' '}
                <Text style={{ color: colors.primary }}>Privacy Policy</Text>.
              </Text>
            </View>

            {/* Login link */}
            <View style={s.footer}>
              <Text style={[s.footerText, { color: colors.textSecondary }]}>Already have an account? </Text>
              <TouchableOpacity testID="register-login-link" onPress={() => router.replace('/auth/login')}>
                <Text style={[s.footerLink, { color: colors.primary }]}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: { paddingTop: 12, paddingBottom: 4, alignSelf: 'flex-start' },
  header: { alignItems: 'center', paddingTop: 12, paddingBottom: 28 },
  logoMark: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontSize: 15, textAlign: 'center' },
  form: { gap: 16 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  errorBannerText: { fontSize: 13, fontWeight: '500', flex: 1 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', letterSpacing: 0.2 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, minHeight: 52 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, paddingVertical: 14 },
  eyeBtn: { padding: 4 },
  fieldError: { fontSize: 12, color: '#EF4444', fontWeight: '500' },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: '500', width: 50, textAlign: 'right' },
  ctaBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 6 },
  ctaBtnDisabled: { opacity: 0.7 },
  ctaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  ctaText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  terms: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 28 },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '700' },
});