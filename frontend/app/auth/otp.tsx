import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, useColorScheme, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../../store/useAuthStore';
import { Colors } from '../../utils/theme';

const OTP_LENGTH = 6;

export default function OtpScreen() {
  const router = useRouter();
  const { verifyOtp, sendOtp, pendingOtpEmail, pendingOtpAction, clearPendingOtp } = useAuthStore();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? Colors.dark : Colors.light;

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [success, setSuccess] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!pendingOtpEmail) {
      router.replace('/auth/login');
      return;
    }
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startTimer = () => {
    setResendTimer(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDigitChange = (text: string, index: number) => {
    const cleaned = text.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);
    setError('');

    if (cleaned && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (cleaned && index === OTP_LENGTH - 1) {
      const all = [...newDigits.slice(0, OTP_LENGTH - 1), cleaned].join('');
      if (all.length === OTP_LENGTH) handleVerify(all);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
    }
  };

  const handleVerify = async (otpOverride?: string) => {
    const otp = otpOverride || digits.join('');
    if (otp.length < OTP_LENGTH) {
      setError('Please enter all 6 digits');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsVerifying(true);
    setError('');

    try {
      const result = await verifyOtp(otp);
      if (result.success) {
        setSuccess(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Auth store updated → root layout will redirect
        setTimeout(() => {
          if (pendingOtpAction === 'register') {
            router.replace('/onboarding');
          }
          // login → redirects to (tabs) automatically via root layout
        }, 800);
      } else {
        setError(result.message);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setDigits(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!pendingOtpEmail || !pendingOtpAction || resendTimer > 0) return;
    setIsResending(true);
    try {
      const result = await sendOtp(pendingOtpEmail, pendingOtpAction);
      if (result.success) {
        startTimer();
        setDigits(Array(OTP_LENGTH).fill(''));
        setError('');
        Alert.alert('OTP Resent', result.message);
      } else {
        setError(result.message);
      }
    } finally {
      setIsResending(false);
    }
  };

  const maskedEmail = pendingOtpEmail
    ? pendingOtpEmail.replace(/(.{2}).*(@.*)/, '$1***$2')
    : '';

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <TouchableOpacity
          onPress={() => { clearPendingOtp(); router.back(); }}
          style={s.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={s.content}>
          {/* Icon */}
          <View style={[s.iconWrap, { backgroundColor: success ? colors.primary + '20' : colors.primary + '15' }]}>
            {success ? (
              <Ionicons name="checkmark-circle" size={44} color={colors.primary} />
            ) : (
              <Ionicons name="mail-open-outline" size={44} color={colors.primary} />
            )}
          </View>

          <Text style={[s.title, { color: colors.textPrimary }]}>
            {success ? 'Verified!' : 'Check your email'}
          </Text>
          <Text style={[s.subtitle, { color: colors.textSecondary }]}>
            {success
              ? 'You\'re all set. Redirecting you now...'
              : `We sent a 6-digit code to\n${maskedEmail}`}
          </Text>

          {!success && (
            <>
              {/* OTP Inputs */}
              <View style={s.otpRow}>
                {digits.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={ref => { inputRefs.current[i] = ref; }}
                    style={[
                      s.otpBox,
                      {
                        backgroundColor: colors.surface,
                        borderColor: error ? '#EF4444' : digit ? colors.primary : colors.border,
                        color: colors.textPrimary,
                        borderWidth: digit ? 2 : 1.5,
                      },
                    ]}
                    value={digit}
                    onChangeText={t => handleDigitChange(t, i)}
                    onKeyPress={e => handleKeyPress(e, i)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    textAlign="center"
                    editable={!isVerifying && !success}
                  />
                ))}
              </View>

              {error ? (
                <View style={s.errorRow}>
                  <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
                  <Text style={s.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Verify button */}
              <TouchableOpacity
                style={[s.verifyBtn, (isVerifying || digits.join('').length < OTP_LENGTH) && s.verifyBtnDisabled]}
                onPress={() => handleVerify()}
                disabled={isVerifying || digits.join('').length < OTP_LENGTH}
              >
                <LinearGradient
                  colors={['#22C55E', '#16A34A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={s.verifyGrad}
                >
                  {isVerifying ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="shield-checkmark-outline" size={18} color="#fff" />
                      <Text style={s.verifyText}>Verify code</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Resend */}
              <View style={s.resendRow}>
                <Text style={[s.resendLabel, { color: colors.textSecondary }]}>Didn't receive it? </Text>
                {resendTimer > 0 ? (
                  <Text style={[s.resendTimer, { color: colors.textMuted }]}>
                    Resend in {resendTimer}s
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResend} disabled={isResending}>
                    {isResending ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <Text style={[s.resendLink, { color: colors.primary }]}>Resend OTP</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  backBtn: { paddingHorizontal: 20, paddingTop: 12 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 20 },
  iconWrap: { width: 88, height: 88, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  otpRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 14,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  errorText: { fontSize: 13, color: '#EF4444', fontWeight: '500' },
  verifyBtn: { width: '100%', borderRadius: 14, overflow: 'hidden' },
  verifyBtnDisabled: { opacity: 0.6 },
  verifyGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  verifyText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  resendRow: { flexDirection: 'row', alignItems: 'center' },
  resendLabel: { fontSize: 14 },
  resendTimer: { fontSize: 14, fontWeight: '600' },
  resendLink: { fontSize: 14, fontWeight: '700' },
});