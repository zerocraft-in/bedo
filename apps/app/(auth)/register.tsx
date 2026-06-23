// app/(auth)/register.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

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

  const [loading, setLoading] = useState(false);

  const [cooldown, setCooldown] = useState(0);

  const [devOtp, setDevOtp] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = "Enter a valid email";
    }

    return nextErrors;
  };

  const handleSendOtp = async () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!agreed) {
      Alert.alert(
        "Terms Required",
        "Please agree to the Terms of Service and Privacy Policy.",
      );
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const result = await sendOtp(email);

      if (result?.otp) {
        setDevOtp(result.otp);
      }

      setStep("otp");
      setCooldown(RESEND_COOLDOWN);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "Failed to send verification code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;

    try {
      setLoading(true);

      const result = await sendOtp(email);

      if (result?.otp) {
        setDevOtp(result.otp);
      }

      setOtp("");
      setCooldown(RESEND_COOLDOWN);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "Failed to resend verification code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setErrors({
        otp: "Enter the 6-digit verification code",
      });
      return;
    }

    try {
      setLoading(true);

      await verifyOtp(email, otp, name);

      router.replace("/onboarding/gender");
    } catch (error: any) {
      setErrors({
        otp: error?.message || "Invalid verification code",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOtp();
    }
  }, [otp]);

  const handleBack = () => {
    if (step === "otp") {
      setOtp("");
      setStep("details");
      return;
    }

    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <SafeAreaView className="flex-1" style={{ flex: 1 }}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 24,
              paddingBottom: 40,
            }}
          >
            <Pressable
              onPress={handleBack}
              className="w-12 h-12 rounded-full border border-accent items-center justify-center mt-2 mb-8"
            >
              <ChevronLeftIcon width={22} height={22} color="white" />
            </Pressable>

            {step === "details" ? (
              <>
                <Text className="text-white text-4xl font-bold mb-2">
                  Create Account
                </Text>

                <Text className="text-zinc-400 text-base mb-8">
                  Join thousands building better habits.
                </Text>

                <Field
                  label="Full Name"
                  value={name}
                  onChange={setName}
                  placeholder="John Doe"
                  error={errors.name}
                />

                <Field
                  label="Email Address"
                  value={email}
                  onChange={setEmail}
                  placeholder="john@example.com"
                  keyboardType="email-address"
                  error={errors.email}
                />

                <Pressable
                  onPress={() => setAgreed(!agreed)}
                  className="flex-row items-center mb-8"
                >
                  <View
                    className={cn(
                      "w-6 h-6 rounded-md border mr-3 items-center justify-center",
                      agreed
                        ? "bg-yellow-500 border-yellow-500"
                        : "border-zinc-700",
                    )}
                  >
                    {agreed && <Text className="text-black font-bold">✓</Text>}
                  </View>

                  <Text className="flex-1 text-zinc-400 text-sm leading-5">
                    I agree to the{" "}
                    <Text className="text-yellow-500 font-semibold">
                      Terms of Service
                    </Text>{" "}
                    and{" "}
                    <Text className="text-yellow-500 font-semibold">
                      Privacy Policy
                    </Text>
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleSendOtp}
                  disabled={loading}
                  className={cn(
                    "h-14 rounded-2xl items-center justify-center mb-6",
                    loading ? "bg-yellow-700" : "bg-yellow-500",
                  )}
                >
                  <Text className="text-black text-lg font-bold">
                    {loading ? "Sending Code..." : "Create Account"}
                  </Text>
                </Pressable>

                <Divider />

                <Pressable className="h-14 rounded-2xl border border-zinc-800 bg-zinc-950 flex-row items-center justify-center mb-4">
                  <GoogleIcon width={22} height={22} className="text-foreground" strokeWidth={2} />

                  <Text className="text-white font-semibold ml-3">
                    Continue with Google
                  </Text>
                </Pressable>

                <Pressable className="h-14 rounded-2xl border border-zinc-800 bg-zinc-950 flex-row items-center justify-center mb-8">
                  <AppleIcon width={22} height={22} className="text-foreground" strokeWidth={2}/>

                  <Text className="text-white font-semibold ml-3">
                    Continue with Apple
                  </Text>
                </Pressable>

                <View className="flex-row justify-center">
                  <Text className="text-zinc-400">
                    Already have an account?
                  </Text>

                  <Pressable onPress={() => router.push("/(auth)/login")}>
                    <Text className="text-yellow-500 font-semibold ml-1">
                      Sign In
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text className="text-white text-4xl font-bold mb-2">
                  Verify Email
                </Text>

                <Text className="text-zinc-400 text-base mb-8">
                  Enter the code sent to{"\n"}
                  <Text className="text-yellow-500 font-semibold">{email}</Text>
                </Text>

                {!!devOtp && (
                  <View className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-8">
                    <Text className="text-center text-zinc-300">
                      Demo OTP:
                      <Text className="text-yellow-500 font-bold tracking-[4px]">
                        {" "}
                        {devOtp}
                      </Text>
                    </Text>
                  </View>
                )}

                <OtpInput value={otp} onChange={setOtp} error={errors.otp} />

                <Pressable
                  onPress={handleVerifyOtp}
                  disabled={loading || otp.length < 6}
                  className={cn(
                    "h-14 rounded-2xl items-center justify-center mt-8 mb-5",
                    loading || otp.length < 6 ? "bg-zinc-800" : "bg-yellow-500",
                  )}
                >
                  <Text className="text-black text-lg font-bold">
                    {loading ? "Verifying..." : "Verify & Continue"}
                  </Text>
                </Pressable>

                <Pressable disabled={cooldown > 0} onPress={handleResendOtp}>
                  <Text
                    className={cn(
                      "text-center text-base",
                      cooldown > 0 ? "text-zinc-600" : "text-yellow-500",
                    )}
                  >
                    {cooldown > 0
                      ? `Resend code in ${cooldown}s`
                      : "Resend Code"}
                  </Text>
                </Pressable>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

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
  onChange: (value: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address";
  error?: string;
}) {
  return (
    <View className="mb-5">
      <Text className="text-zinc-400 text-sm font-medium mb-2">{label}</Text>

      <View
        className={cn(
          "h-14 rounded-2xl bg-accent border px-4 text-foreground text-base overflow-hidden",
          error ? "border-red-500" : "border-zinc-800",
        )}
      >
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#71717a"
          keyboardType={keyboardType}
          autoCapitalize="none"
          className={cn(
            "h-14  bg-accent px-4 text-foreground text-base overflow-hidden",
          )}
        />
      </View>

      {!!error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}

function Divider() {
  return (
    <View className="flex-row items-center mb-6">
      <View className="flex-1 h-px bg-zinc-800" />

      <Text className="mx-4 text-zinc-500 text-sm">or</Text>

      <View className="flex-1 h-px bg-zinc-800" />
    </View>
  );
}
