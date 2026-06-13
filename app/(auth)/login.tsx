// app/(auth)/login.tsx
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "At least 6 characters.";
    return e;
  }

  async function handleLogin() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    // ── Replace with your real auth call ──────────────────────────────────
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    router.replace("/(tabs)");
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0f0500" }}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#0a0a0a", "#262626", "#0a0a0a", "#262626"]}
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
              paddingBottom: 32,
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
              Welcome back
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 15,
                marginBottom: 36,
              }}
            >
              Sign in to continue your journey.
            </Text>

            {/* Email */}
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
                EMAIL
              </Text>
              <TextInput
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="you@email.com"
                placeholderTextColor="rgba(255,255,255,0.25)"
                autoCapitalize="none"
                keyboardType="email-address"
                style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  borderWidth: 1,
                  borderColor: errors.email
                    ? "#ef4444"
                    : "rgba(255,255,255,0.12)",
                  borderRadius: 16,
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                  color: "#fff",
                  fontSize: 16,
                }}
              />
              {errors.email && (
                <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Login button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className={cn(
                "rounded-2xl bg-yellow-600 py-5 items-center mb-6",
                loading && "opacity-50",
              )}
              activeOpacity={0.85}
            >
              <Text
                className="text-foreground font-bold text-lg"
              >
                {loading ? "Signing in…" : "Sign In"}
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
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
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
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              />
            </View>

            <TouchableOpacity
              className="rounded-2xl border border-accent py-5"
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 36,
                gap: 10,
              }}
              activeOpacity={0.75}
            >
              <Text style={{ fontSize: 20 }}>🌐</Text>
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Sign up link */}
             <View  className="flex-1 flex-row justify-center">
              <Text className="text-secondary">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                <Text className="text-yellow-600 font-bold text-base">
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
