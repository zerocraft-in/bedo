// app/(auth)/register.tsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

export default function RegisterScreen() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  function set(field: keyof FormState) {
    return (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "At least 8 characters.";
    if (!form.confirm) e.confirm = "Please confirm your password.";
    else if (form.confirm !== form.password)
      e.confirm = "Passwords don't match.";
    return e;
  }

  async function handleRegister() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    if (!agreed) {
      alert("Please agree to the Terms & Privacy Policy.");
      return;
    }
    setErrors({});
    setLoading(true);
    // ── Replace with your real sign-up call ───────────────────────────────
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    // After sign-up, go through onboarding
    router.push("/(auth)/onboarding/gender");
  }

  const Field = ({
    label,
    field,
    placeholder,
    keyboardType = "default",
    secure = false,
    show,
    onToggle,
  }: {
    label: string;
    field: keyof FormState;
    placeholder: string;
    keyboardType?: "default" | "email-address";
    secure?: boolean;
    show?: boolean;
    onToggle?: () => void;
  }) => (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: 13,
          fontWeight: "600",
          marginBottom: 8,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
      <View style={{ position: "relative" }}>
        <TextInput
          value={form[field]}
          onChangeText={set(field)}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.25)"
          autoCapitalize={field === "name" ? "words" : "none"}
          keyboardType={keyboardType}
          secureTextEntry={secure && !show}
          style={{
            backgroundColor: "rgba(255,255,255,0.07)",
            borderWidth: 1,
            borderColor: errors[field] ? "#ef4444" : "rgba(255,255,255,0.12)",
            borderRadius: 16,
            paddingHorizontal: 18,
            paddingVertical: 16,
            paddingRight: secure ? 54 : 18,
            color: "#fff",
            fontSize: 16,
          }}
        />
        {secure && onToggle && (
          <TouchableOpacity
            onPress={onToggle}
            style={{
              position: "absolute",
              right: 18,
              top: 0,
              bottom: 0,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 18 }}>
              {show ? "🙈" : "👁"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {errors[field] && (
        <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>
          {errors[field]}
        </Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0f0500" }}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#262626", "#0a0a0a", "#262626", "#0a0a0a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
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
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-14 h-14 mb-5 rounded-3xl bg-accent border border-accent items-center justify-center overflow-hidden"
            >
              <ChevronLeftIcon className="w-6 h-6 text-secondary" />
            </TouchableOpacity>

            {/* Heading */}
            <Text
              style={{
                color: "#fff",
                fontSize: 34,
                fontWeight: "800",
                letterSpacing: -0.5,
                marginBottom: 6,
              }}
            >
              Create account
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 15,
                marginBottom: 32,
              }}
            >
              Join thousands building better habits.
            </Text>

            <Field label="NAME" field="name" placeholder="Jordan Eagle" />
            <Field
              label="EMAIL"
              field="email"
              placeholder="you@email.com"
              keyboardType="email-address"
            />

            {/* Terms agreement */}
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
                className={cn(
                  "border border-accent",
                  agreed && "border-yellow-600 bg-yellow-600",
                )}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 1,
                }}
              >
                {agreed && (
                  <Text
                    style={{ color: "#000", fontSize: 13, fontWeight: "700" }}
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
                <Text style={{ color: "#fb923c", fontWeight: "600" }}>
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text style={{ color: "#fb923c", fontWeight: "600" }}>
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Register button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className={cn(
                "rounded-2xl bg-yellow-600 py-5 items-center mb-6",
                loading && "opacity-50",
              )}
              activeOpacity={0.85}
            >
              <Text className="text-foreground font-bold text-lg">
                {loading ? "Creating account…" : "Create Account"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <View className="flex-1 h-px bg-accent" />
              <Text
                style={{
                  color: "rgba(255,255,255,0.35)",
                  marginHorizontal: 14,
                  fontSize: 13,
                }}
              >
                or
              </Text>
              <View className="flex-1 h-px bg-accent" />
            </View>

            <TouchableOpacity
              className="rounded-2xl border  py-5  border-accent
          bg-white/5"
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 32,
                gap: 10,
              }}
              activeOpacity={0.75}
            >
              <Text style={{ fontSize: 20 }}>🌐</Text>
              <Text className="text-foreground font-bold text-lg">
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Sign in link */}
            <View className="flex-1 flex-row justify-center">
              <Text className="text-secondary">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text className="text-yellow-600 font-bold text-base">
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
