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

export default function LoginScreen() {
  const router = useRouter();
  const { loginWithPassword, sendOtp } = useAuthStore();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Colors.dark : Colors.light;
  const isDark = scheme === 'dark';

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGoogleLogin = async () => {
    if (!validate()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLoading(true);
    setErrors({});
    try {
      const result = await loginWithPassword(email.trim(), 'google');
      if (!result.success) {
        setErrors({ general: result.message });
      }
      // On success, auth store updates → root layout redirects
    } catch {
      setErrors({ general: 'Something went wrong. Try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Enter a valid email' });
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLoading(true);
    setErrors({});
    try {
      const result = await sendOtp(email.trim(), 'login');
      if (result.success) {
        Alert.alert('OTP Sent', result.message, [{ text: 'OK', onPress: () => router.push('/auth/otp') }]);
      } else {
        setErrors({ general: result.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={s.safe} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={s.flex}
        >
          <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Header */}
            <View style={s.header}>
              <View style={[s.logoMark, { backgroundColor: colors.primary }]}>
                <Ionicons name="flash" size={26} color="#fff" />
              </View>
              <Text style={[s.appName, { color: colors.primary }]}>FitAI</Text>
              <Text style={[s.title, { color: colors.textPrimary }]}>Welcome back</Text>
              <Text style={[s.subtitle, { color: colors.textSecondary }]}>
                Sign in to continue your fitness journey
              </Text>
            </View>

            {/* Demo hint */}
            <View style={[s.demoHint, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
              <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
              <Text style={[s.demoText, { color: colors.primary }]}>
                Demo: alex@fitai.com / password123
              </Text>
            </View>


            {/* Form */}
            <View style={s.form}>

              <TouchableOpacity
                testID="login-google-button"
                style={[s.ctaBtn, s.ctaGrad, s.ctaBtnGoogle, isLoading && s.ctaBtnGDisabled]}
                onPress={handleGoogleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name={'logo-google'} size={18} color="#fff" />
                    <Text style={s.ctaText}>
                      Continue with Google
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              {errors.general && (
                <View style={[s.errorBanner, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
                  <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
                  <Text style={[s.errorBannerText, { color: '#EF4444' }]}>{errors.general}</Text>
                </View>
              )}

              {/* Email */}
              <View style={s.fieldGroup}>
                <Text style={[s.label, { color: colors.textSecondary }]}>Email address</Text>
                <View style={[
                  s.inputWrap,
                  { backgroundColor: colors.surface, borderColor: errors.email ? '#EF4444' : colors.border }
                ]}>
                  <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={s.inputIcon} />
                  <TextInput
                    testID="login-email-input"
                    style={[s.input, { color: colors.textPrimary }]}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.textMuted}
                    value={email}
                    onChangeText={t => { setEmail(t); setErrors(prev => ({ ...prev, email: undefined, general: undefined })); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>
                {errors.email && <Text style={s.fieldError}>{errors.email}</Text>}
              </View>


              {/* CTA */}
              <TouchableOpacity
                testID="login-submit-button"
                style={[s.ctaBtn, isLoading && s.ctaBtnDisabled]}
                onPress={handleSendOtp}
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
                      <Text style={s.ctaText}>
                        Continue with OTP
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>




            </View>

            {/* Register link */}
            <View style={s.footer}>
              <Text style={[s.footerText, { color: colors.textSecondary }]}>Don't have an account? </Text>
              <TouchableOpacity testID="login-register-link" onPress={() => router.push('/auth/register')}>
                <Text style={[s.footerLink, { color: colors.primary }]}>Create account</Text>
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
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 28 },
  logoMark: { width: 60, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  appName: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5, marginBottom: 16 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  demoHint: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 20 },
  demoText: { fontSize: 13, fontWeight: '500', flex: 1 },
  modeToggle: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, padding: 4, marginBottom: 24 },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  modeBtnText: { fontSize: 14, fontWeight: '600' },
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
  ctaBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 6 },
  ctaBtnGoogle: { borderWidth: 1, borderColor: '#E5E7EB' },
  ctaBtnDisabled: { opacity: 0.7 },
    ctaBtnGDisabled: {  borderWidth: 0, borderColor: '#E5E7EB' },
  ctaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  ctaText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  forgotBtn: { alignItems: 'center', paddingVertical: 8 },
  forgotText: { fontSize: 14, fontWeight: '500' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 28 },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '700' },
});