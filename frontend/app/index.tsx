import { Redirect } from 'expo-router';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import React from "react"
export default function Index() {
  const hasCompletedOnboarding = useAppStore(s => s.hasCompletedOnboarding);
  const isLoading = useAppStore(s => s.isLoading);
  const { isAuthenticated, isAuthLoading } = useAuthStore();

  if (isLoading || isAuthLoading) return null;

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}