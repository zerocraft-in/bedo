// app/_layout.tsx
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import "../global.css";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, router, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "@/lib/auth";
// Inner layout reads the resolved theme to apply the NativeWind `dark` class
function InnerLayout() {
  const { isDark } = useTheme();

  const { session, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === "(auth)";

    if (!session) {
      // Not logged in → send to auth
      if (!inAuth) router.replace("/(auth)");
    } else if (!session.user.onboardingComplete) {
      // Logged in but hasn't finished onboarding
      if (segments[1] !== "onboarding") {
        router.replace("/(auth)/onboarding/gender");
      }
    } else {
      // Fully authenticated → send to app
      if (inAuth) router.replace("/(tabs)");
    }
  }, [session, isLoading, segments]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0a0a0a",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#ca8a04" size="large" />
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View className={`flex-1 ${isDark ? "dark" : ""}`}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#000" },
          animation: "fade",
        }}
      >
        {/* Auth group: onboarding, login, register */}
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false, animation: "fade" }}
        />
        {/* Main app tabs */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, animation: "fade" }}
        />
        {/* Individual full-screen routes */}
        <Stack.Screen
          name="story"
          options={{
            headerShown: false,
            presentation: "fullScreenModal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="notification"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        {/* <Stack.Screen
          name="nutrition"
          options={{ headerShown: false, animation: "slide_from_right" }}
        /> */}

         {/* <Stack.Screen
          name="challanges"
          options={{ headerShown: false, animation: "slide_from_right" }}
        /> */}
        <Stack.Screen
          name="profile"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="settings"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </View>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InnerLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
