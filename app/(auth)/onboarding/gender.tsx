// /(auth)/onboarding/gender.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const genders = ["Male", "Female", "Other"];

export default function GenderScreen() {
  return (
    <View className="flex-1 bg-primary px-6 justify-center">
      <Text className="text-white text-3xl font-bold mb-3">
        What's your gender?
      </Text>

      <Text className="text-gray-400 mb-8">
        This helps us personalize your plan.
      </Text>

      {genders.map((item) => (
        <TouchableOpacity
          key={item}
          className="bg-secondary rounded-3xl p-5 mb-4"
        >
          <Text className="text-white text-lg">{item}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={() => router.push("/(auth)/onboarding/height")}
        className="bg-accent rounded-full py-4 mt-6"
      >
        <Text className="text-center font-semibold text-black">
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}