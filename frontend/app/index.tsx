import { Redirect } from 'expo-router';
import { useAppStore } from '../store/useAppStore';

export default function Index() {
  const hasCompletedOnboarding = useAppStore(s => s.hasCompletedOnboarding);
  const isLoading = useAppStore(s => s.isLoading);

  if (isLoading) return null;

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }
  return <Redirect href="/(tabs)" />;
}
