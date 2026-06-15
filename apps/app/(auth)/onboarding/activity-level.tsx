// /(auth)/onboarding/activity-level.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const levels = [
  "Sedentary",
  "Lightly Active",
  "Moderately Active",
  "Very Active",
];

export default function ActivityLevelScreen() {
  return (
    <View className="flex-1 bg-primary px-6 justify-center">
      <Text className="text-white text-3xl font-bold mb-3">
        Activity Level
      </Text>

      <Text className="text-gray-400 mb-8">
        How active are you daily?
      </Text>

      {levels.map((level) => (
        <TouchableOpacity
          key={level}
          className="bg-secondary rounded-3xl p-5 mb-4"
        >
          <Text className="text-white text-lg">{level}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={() => router.replace("/(tabs)")}
        className="bg-accent rounded-full py-4 mt-6"
      >
        <Text className="text-center font-semibold text-black">
          Finish
        </Text>
      </TouchableOpacity>
    </View>
  );
}