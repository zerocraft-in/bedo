// app/_layout.tsx

import { useEffect, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Stack, router, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "../global.css";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/lib/auth";

function AppNavigator() {
  const { isDark } = useTheme();
  const { session, isLoading } = useAuth();
  const segments = useSegments() as string[];

  const inAuthGroup = useMemo(() => segments[0] === "(auth)", [segments]);

  useEffect(() => {
    if (isLoading) return;

    // User not authenticated
    if (!session) {
      if (!inAuthGroup) {
        router.replace("/(auth)");
      }
      return;
    }

    // User authenticated but onboarding incomplete
    if (!session.user?.onboardingComplete) {
      const isOnboarding = segments.includes("onboarding");

      if (!isOnboarding) {
        router.replace("/(auth)/onboarding/gender");
      }
      return;
    }

    // User fully authenticated
    if (inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, isLoading, segments, inAuthGroup]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#00000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#ca8a04" />
      </View>
    );
  }

  const isLoggedIn = true;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className={`flex-1 bg-background ${isDark ? "dark" : ""}`}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack>
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/register" />
          </Stack.Protected>
          <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
                animation: "fade",
              }}
            />

            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                animation: "fade",
              }}
            />

            <Stack.Screen
              name="story"
              options={{
                headerShown: false,
                presentation: "fullScreenModal",
                animation: "slide_from_bottom",
              }}
            />

            <Stack.Screen
              name="profile"
              options={{
                animation: "slide_from_right",
              }}
            />

            <Stack.Screen
              name="settings"
              options={{
                headerShown: false,
                animation: "slide_from_right",
              }}
            />

            <Stack.Screen
              name="notification"
              options={{
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack.Protected>
        </Stack>
      </View>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
