// lib/guards/AuthGuard.tsx

import { useEffect } from "react";
import { router, useSegments } from "expo-router";
import { useAuthStore } from "@/stores/auth.store";

export default function AuthGuard() {
  const segments = useSegments();

  const {
    session,
    loading,
  } = useAuthStore();

  useEffect(() => {
    if (loading) return;

    const inAuth =
      segments[0] === "(auth)";

    const inOnboarding =
      segments[1] === "onboarding";

    if (!session) {
      if (!inAuth) {
        router.replace("/(auth)");
      }

      return;
    }

    if (
      !session.user.onboardingComplete
    ) {
      if (!inOnboarding) {
        router.replace(
          "/(auth)/onboarding/gender"
        );
      }

      return;
    }

    if (
      inAuth ||
      inOnboarding
    ) {
      router.replace("/(tabs)");
    }
  }, [
    session,
    loading,
    segments,
  ]);

  return null;
}