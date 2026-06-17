// lib/onboarding-store.tsx
// Holds onboarding answers in memory. Passed down via context.
// Call saveOnboarding() on the last step to persist and redirect.

import { createContext, useContext, useState, ReactNode } from "react";
import { router } from "expo-router";
import { useAuth } from "./auth";

export interface OnboardingData {
  gender?: string;
  height?: number; // cm
  weight?: number; // kg
  goal?: string;
  activityLevel?: string;
}

interface OnboardingContextValue {
  data: OnboardingData;
  set: (patch: Partial<OnboardingData>) => void;
  finish: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { completeOnboarding } = useAuth();
  const [data, setData] = useState<OnboardingData>({});

  function set(patch: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  async function finish() {
    // TODO: send `data` to your backend here
    await completeOnboarding();
    router.replace("/(tabs)");
  }

  return (
    <OnboardingContext.Provider value={{ data, set, finish }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}