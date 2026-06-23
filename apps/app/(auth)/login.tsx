// app/(auth)/login.tsx
// Login via email OTP — two steps: enter email → enter OTP (with resend).

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth";
import OtpInput from "@/lib/OtpInput";
import { ChevronLeftIcon, GoogleIcon, AppleIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";

const RESEND_COOLDOWN = 30; // seconds

export default function LoginScreen() {
  const { sendOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState(""); // shown in dev banner
  const [cooldown, setCooldown] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function validateEmail() {
    if (!email.trim()) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email.";
    return "";
  }

  // ── Step 1: send OTP ────────────────────────────────────────────────────────
  async function handleSendOtp() {
    const err = validateEmail();
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError("");
    setLoading(true);
    try {
      const { otp: generated } = await sendOtp(email);
      setDevOtp(generated);
      setStep("otp");
      setCooldown(RESEND_COOLDOWN);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  // ── Resend OTP ──────────────────────────────────────────────────────────────
  async function handleResend() {
    if (cooldown > 0) return;
    setLoading(true);
    setOtp("");
    setOtpError("");
    try {
      const { otp: generated } = await sendOtp(email);
      setDevOtp(generated);
      setCooldown(RESEND_COOLDOWN);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: verify OTP ──────────────────────────────────────────────────────
  async function handleVerify() {
    if (otp.length < 6) {
      setOtpError("Enter the 6-digit code.");
      return;
    }
    setOtpError("");
    setLoading(true);
    try {
      const user = await verifyOtp(email, otp);
      // RootGuard will handle redirect based on session
    } catch (e: any) {
      setOtpError(e.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-verify when all 6 digits entered
  useEffect(() => {
    if (otp.length === 6) handleVerify();
  }, [otp]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#0a0a0a", "#0a0a0a"]}
        style={{ position: "absolute", inset: 0 }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 28,
              paddingBottom: 40,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Back button */}
            <TouchableOpacity
              onPress={
                step === "otp"
                  ? () => {
                      setStep("email");
                      setOtp("");
                      setOtpError("");
                    }
                  : () => router.back()
              }
              className="w-14 h-14 mb-5 rounded-3xl  border border-accent items-center justify-center overflow-hidden"
            >
              <ChevronLeftIcon className="w-6 h-6 text-secondary" />
            </TouchableOpacity>

            {step === "email" ? (
              <>
                <View>
                  <Text style={styles.heading}>Welcome back</Text>
                  <Text style={styles.subheading}>
                    Sign in to continue your journey.
                  </Text>
                </View>

                {/* Email field */}
                <View style={{ marginBottom: 24 }}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      setEmailError("");
                    }}
                    placeholder="you@email.com"
                    placeholderTextColor="rgba(255,255,255,0.25)"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={[
                      styles.input,
                      emailError ? styles.inputError : null,
                    ]}
                    returnKeyType="send"
                    onSubmitEditing={handleSendOtp}
                  />
                  {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  onPress={handleSendOtp}
                  disabled={loading}
                  className={cn(
                    "rounded-2xl bg-yellow-600 py-5 items-center mb-6",
                    loading && "opacity-50",
                  )}
                >
                  <Text className="text-foreground font-bold text-lg">
                    {loading ? "Sending code…" : "Continue"}
                  </Text>
                </TouchableOpacity>

                <Divider />

                <SocialButtons />

                <View className="flex-row justify-center mt-6">
                  <Text className="text-secondary">
                    Don't have an account?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(auth)/register")}
                  >
                    <Text className="text-yellow-600 font-bold text-base">
                      Sign up
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View>
                  <Text style={styles.heading}>Check your email</Text>
                  <Text style={styles.subheading}>
                    We sent a 6-digit code to{"\n"}
                    <Text style={{ color: "#ca8a04", fontWeight: "600" }}>
                      {email}
                    </Text>
                  </Text>
                </View>
                {/* Dev OTP banner */}
                {devOtp ? (
                  <View style={styles.otpBanner}>
                    <Text style={styles.devText}>
                      🧪 Your demo OTP:{" "}
                      <Text
                        style={{
                          fontWeight: "800",
                          letterSpacing: 2,
                          color: "#ca8a04",
                        }}
                      >
                        {devOtp}
                      </Text>
                    </Text>
                  </View>
                ) : null}

                <View style={{ marginBottom: 32 }}>
                  <OtpInput value={otp} onChange={setOtp} error={otpError} />
                </View>

                <TouchableOpacity
                  onPress={handleVerify}
                  disabled={loading || otp.length < 6}
                  className={cn(
                    "rounded-2xl bg-yellow-600 py-5 items-center mb-6",
                    (loading || otp.length < 6) && "opacity-50",
                  )}
                >
                  <Text className="text-foreground font-bold text-lg">
                    {loading ? "Verifying…" : "Verify & Sign In"}
                  </Text>
                </TouchableOpacity>

                {/* Resend */}
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={cooldown > 0 || loading}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: cooldown > 0 ? "rgba(255,255,255,0.3)" : "#ca8a04",
                      fontSize: 14,
                    }}
                  >
                    {cooldown > 0
                      ? `Resend code in ${cooldown}s`
                      : "Resend code"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function Divider() {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}
    >
      <View
        style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.1)" }}
      />
      <Text
        style={{
          color: "rgba(255,255,255,0.35)",
          marginHorizontal: 14,
          fontSize: 13,
        }}
      >
        or
      </Text>
      <View
        style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.1)" }}
      />
    </View>
  );
}

function SocialButtons() {
  // Only Google Auth
  return (
    <>
      <TouchableOpacity
        className="rounded-2xl border border-accent py-5 mb-4"
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <GoogleIcon className="w-7 h-7 text-foreground" strokeWidth={2} />
        <Text className="text-lg text-foreground font-bold">
          Continue with Google
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles: Record<string, any> = {
  heading: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subheading: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    marginBottom: 24,
    lineHeight: 22,
  },
  label: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: "#fff",
    fontSize: 16,
  },
  inputError: { borderColor: "#ef4444" },
  errorText: { color: "#ef4444", fontSize: 12, marginTop: 6 },
  devBanner: {
    backgroundColor: "rgba(202,138,4,0.08)",
    borderWidth: 1,
    borderColor: "rgba(202,138,4,0.2)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  otpBanner: {
    backgroundColor: "rgba(202,138,4,0.1)",
    borderWidth: 1,
    borderColor: "rgba(202,138,4,0.3)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 28,
    alignItems: "center",
  },
  devText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    lineHeight: 18,
  },
};
