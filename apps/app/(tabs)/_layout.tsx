// /(tabs)/_layout.tsx
import FloatingTabBar from "@/components/FloatingBottomBar";
import { Tabs } from "expo-router";
import { Platform, View, Text } from "react-native";



export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="workouts" />
      <Tabs.Screen
        name="notification"
        options={{ tabBarStyle: { display: "none" } }}
      />
    </Tabs>
  );
}
