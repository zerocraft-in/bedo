import { Tabs } from 'expo-router';
import FloatingTabBar, { TAB_BAR_HEIGHT, TAB_BAR_MARGIN } from '@/components/ui/FloatingTabBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';

export { TAB_BAR_HEIGHT, TAB_BAR_MARGIN };

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="workouts" />
      <Tabs.Screen name="coach"      options={{ tabBarStyle: { display: 'none' } }}/>
      <Tabs.Screen name="record" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}