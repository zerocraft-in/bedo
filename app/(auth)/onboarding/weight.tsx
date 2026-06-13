// /(auth)/onboarding/weight.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function WeightScreen() {
  return (
    <View className="flex-1 bg-primary px-6 justify-center">
      <Text className="text-white text-3xl font-bold mb-3">
        Your Weight
      </Text>

      <Text className="text-gray-400 mb-8">
        Enter your current weight.
      </Text>

      <View className="bg-secondary rounded-3xl p-6 mb-8">
        <Text className="text-white text-center text-5xl">
          70 kg
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/onboarding/goal")}
        className="bg-accent rounded-full py-4"
      >
        <Text className="text-center font-semibold text-black">
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}