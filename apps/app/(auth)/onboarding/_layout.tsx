// app/(auth)/onboarding/_layout.tsx
// Wraps all onboarding screens with the OnboardingProvider for shared state.
import { Stack } from "expo-router";
import { OnboardingProvider } from "@/lib/onboarding-store";

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </OnboardingProvider>
  );
}