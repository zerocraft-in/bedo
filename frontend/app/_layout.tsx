import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../utils/theme';

export default function RootLayout() {
  const { isLoading, init, themeMode } = useAppStore();
  const systemScheme = useColorScheme();

  useEffect(() => {
    init();
  }, []);

  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');
  const colors = isDark ? Colors.dark : Colors.light;

  if (isLoading) {
    return (
      <View style={[styles.splash, { backgroundColor: '#0F172A' }]}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <ActivityIndicator size="small" color="#0F172A" />
          </View>
        </View>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding/index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
