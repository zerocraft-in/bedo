// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "../global.css";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
// Inner layout reads the resolved theme to apply the NativeWind `dark` class
function InnerLayout() {
  const { isDark } = useTheme();
  return (
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
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* Main app tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
        <Stack.Screen
          name="nutrition"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
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
  );
}


export default function RootLayout() {
  return (
    <ThemeProvider>
      <InnerLayout />
    </ThemeProvider>
  );
}