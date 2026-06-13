// components/onboarding/CTAButtons.tsx

import { View, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";

export default function CTAButtons() {
  return (
    <View className="gap-4">
      <TouchableOpacity
        onPress={() => router.push("/login")}
        className="h-16 rounded-3xl bg-yellow-600 items-center justify-center"
        activeOpacity={0.60}
      >
        <Text className="text-foreground font-bold text-base">
          Log In
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/register")}
        className="
          h-16
          rounded-3xl
          border
          border-white/20
          bg-white/5
          items-center
          justify-center
        "
            activeOpacity={0.60}
      >
        <Text className="text-white font-semibold">
          Create an Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}