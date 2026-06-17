// /+not-found.tsx
import { Link, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View className="flex-1 bg-[#0A0A0A] items-center justify-center px-6">
        <Text className="text-5xl mb-4">🏋️</Text>
        <Text className="text-white font-bold text-2xl mb-2">
          Page Not Found
        </Text>
        <Text className="text-[#8E8E93] text-sm text-center mb-8">
          This screen doesn't exist. Let's get you back on track.
        </Text>
        <Link href="/(tabs)" asChild>
          <Text className="text-[#FF375F] font-semibold text-base border border-[#FF375F] rounded-full px-6 py-3">
            Back to Home
          </Text>
        </Link>
      </View>
    </>
  );
}