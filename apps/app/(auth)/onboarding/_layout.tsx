// app/(auth)/onboarding/_layout.tsx
// Wraps all onboarding screens with the OnboardingProvider for shared state.
import { Stack } from "expo-router";
import { OnboardingProvider } from "@/lib/onboarding-store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      </GestureHandlerRootView>
    </OnboardingProvider>
  );
}