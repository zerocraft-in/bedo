// /(auth)/_layout.tsx
import { Stack } from "expo-router";
import { View } from "react-native";

export default function AuthLayout() {
  return (
        <View className="flex-1 bg-background">
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
              // contentStyle: { backgroundColor: "transparent" },
            }}
          />
        </View>
  );
}