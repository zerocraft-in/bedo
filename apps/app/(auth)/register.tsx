// app/(auth)/register.tsx
// Register: step 1 = name + email, step 2 = OTP verify → onboarding flow.

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
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth";
import OtpInput from "@/lib/OtpInput";
import { ChevronLeftIcon, GoogleIcon, AppleIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";

const RESEND_COOLDOWN = 30;

export default function RegisterScreen() {
  const { sendOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email.";
    return e;
  }

  // ── Step 1: send OTP ────────────────────────────────────────────────────────
  async function handleSendOtp() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    if (!agreed) {
      Alert.alert("Terms", "Please agree to the Terms & Privacy Policy.");
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const { otp: generated } = await sendOtp(email);
      setDevOtp(generated);
      setStep("otp");
      setCooldown(RESEND_COOLDOWN);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  // ── Resend ──────────────────────────────────────────────────────────────────
  async function handleResend() {
    if (cooldown > 0) return;
    setLoading(true);
    setOtp("");
    try {
      const { otp: generated } = await sendOtp(email);
      setDevOtp(generated);
      setCooldown(RESEND_COOLDOWN);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: verify OTP ──────────────────────────────────────────────────────
  async function handleVerify() {
    if (otp.length < 6) {
      setErrors({ otp: "Enter the 6-digit code." });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await verifyOtp(email, otp, name);
      // RootGuard detects incomplete onboarding → redirects to /onboarding/gender
    } catch (err: any) {
      setErrors({ otp: err.message || "Verification failed." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (otp.length === 6) handleVerify();
  }, [otp]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <StatusBar barStyle="light-content" />
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
            {/* Back */}
            <TouchableOpacity
              onPress={
                step === "otp"
                  ? () => {
                      setStep("details");
                      setOtp("");
                    }
                  : () => router.back()
              }
              className="w-14 h-14 mb-5 rounded-3xl bg-accent border border-accent items-center justify-center overflow-hidden"
            >
              <ChevronLeftIcon className="w-6 h-6 text-secondary" />
            </TouchableOpacity>

            {step === "details" ? (
              <>
                <Text style={S.heading}>Create account</Text>
                <Text style={S.subheading}>
                  Join thousands building better habits.
                </Text>

                <View style={S.devBanner}>
                  <Text style={S.devText}>
                    🧪 Demo mode — OTP will be shown after you submit
                  </Text>
                </View>

                {/* Name */}
                <Field
                  label="Name"
                  value={name}
                  onChange={(t) => {
                    setName(t);
                    setErrors((p) => ({ ...p, name: "" }));
                  }}
                  placeholder="Jordan Eagle"
                  error={errors.name}
                />

                {/* Email */}
                <Field
                  label="Email"
                  value={email}
                  onChange={(t) => {
                    setEmail(t);
                    setErrors((p) => ({ ...p, email: "" }));
                  }}
                  placeholder="you@email.com"
                  keyboardType="email-address"
                  error={errors.email}
                />

                {/* Terms */}
                <TouchableOpacity
                  onPress={() => setAgreed((a) => !a)}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: 28,
                    gap: 12,
                  }}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      S.checkbox,
                      agreed && {
                        backgroundColor: "#ca8a04",
                        borderColor: "#ca8a04",
                      },
                    ]}
                  >
                    {agreed && (
                      <Text
                        style={{
                          color: "#000",
                          fontSize: 13,
                          fontWeight: "700",
                        }}
                      >
                        ✓
                      </Text>
                    )}
                  </View>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: 13,
                      flex: 1,
                      lineHeight: 19,
                    }}
                  >
                    I agree to the{" "}
                    <Text style={{ color: "#ca8a04", fontWeight: "600" }}>
                      Terms of Service
                    </Text>{" "}
                    and{" "}
                    <Text style={{ color: "#ca8a04", fontWeight: "600" }}>
                      Privacy Policy
                    </Text>
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSendOtp}
                  disabled={loading}
                  className={cn(
                    "rounded-2xl bg-yellow-600 py-5 items-center mb-6",
                    loading && "opacity-50",
                  )}
                >
                  <Text className="text-foreground font-bold text-lg">
                    {loading ? "Sending code…" : "Create Account"}
                  </Text>
                </TouchableOpacity>

                <Divider />

                <TouchableOpacity
                  className="rounded-2xl border border-accent py-5 mb-4"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <GoogleIcon
                    className="w-7 h-7 text-foreground"
                    strokeWidth={2}
                  />
                  <Text className="text-lg text-foreground font-bold">
                    Continue with Google
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded-2xl border border-accent py-5 mb-8"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <AppleIcon
                    className="w-7 h-7 text-foreground"
                    strokeWidth={2}
                  />
                  <Text className="text-lg text-foreground font-bold">
                    Continue with Apple
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center">
                  <Text className="text-secondary">
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(auth)/login")}
                  >
                    <Text className="text-yellow-600 font-bold text-base">
                      Sign in
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={S.heading}>Verify email</Text>
                <Text style={S.subheading}>
                  We sent a 6-digit code to{"\n"}
                  <Text style={{ color: "#ca8a04", fontWeight: "600" }}>
                    {email}
                  </Text>
                </Text>

                {devOtp ? (
                  <View style={S.otpBanner}>
                    <Text style={S.devText}>
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
                  <OtpInput value={otp} onChange={setOtp} error={errors.otp} />
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
                    {loading ? "Verifying…" : "Verify & Continue"}
                  </Text>
                </TouchableOpacity>

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

// ── Sub-components ─────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType = "default",
  error,
}: {
  label: string;
  value: string;
  onChange: (t: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address";
  error?: string;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={S.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.25)"
        autoCapitalize="none"
        keyboardType={keyboardType}
        style={[S.input, error ? S.inputError : null]}
      />
      {error ? <Text style={S.errorText}>{error}</Text> : null}
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

const S: Record<string, any> = {
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
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
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
  devText: { color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 18 },
};
