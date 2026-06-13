// /(auth)/onboarding/goal.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const goals = [
  "Lose Weight",
  "Build Muscle",
  "Stay Fit",
  "Improve Health",
];

export default function GoalScreen() {
  return (
    <View className="flex-1 bg-primary px-6 justify-center">
      <Text className="text-white text-3xl font-bold mb-3">
        What's your goal?
      </Text>

      <Text className="text-gray-400 mb-8">
        Select your primary fitness goal.
      </Text>

      {goals.map((goal) => (
        <TouchableOpacity
          key={goal}
          className="bg-secondary rounded-3xl p-5 mb-4"
        >
          <Text className="text-white text-lg">{goal}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={() =>
          router.push("/(auth)/onboarding/activity-level")
        }
        className="bg-accent rounded-full py-4 mt-6"
      >
        <Text className="text-center font-semibold text-black">
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}