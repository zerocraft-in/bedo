// app/(auth)/onboarding/weight.tsx

import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "@/lib/onboarding-store";
import { ProgressBar } from "./gender";

type Unit = "kg" | "lbs";

const MIN_WEIGHT = 30;
const MAX_WEIGHT = 200;

export default function WeightScreen() {
  const { set } = useOnboarding();

  const [weight, setWeight] = useState(70);
  const [unit, setUnit] = useState<Unit>("kg");

  const displayWeight =
    unit === "kg"
      ? `${weight}`
      : `${Math.round(weight * 2.20462)}`;

  const decrease = () => {
    setWeight((prev) => Math.max(MIN_WEIGHT, prev - 1));
  };

  const increase = () => {
    setWeight((prev) => Math.min(MAX_WEIGHT, prev + 1));
  };

  const handleContinue = () => {
    set({ weight });
    router.push("/(auth)/onboarding/goal");
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      <SafeAreaView className="flex-1 px-6" style={{
          flex: 1,
          paddingHorizontal: 24,
        }}>
        <ProgressBar step={3} total={5} />

        <Text className="text-white text-3xl font-bold mt-6">
          Your Weight
        </Text>

        <Text className="text-zinc-400 mt-2">
          Set your current weight
        </Text>

        <View className="flex-1 items-center justify-center">
          {/* Weight Card */}
          <View className="w-full max-w-xs rounded-3xl border border-zinc-800 bg-zinc-950 p-8 items-center">
            <Text className="text-zinc-500 text-sm mb-4">
              Current Weight
            </Text>

            <Text className="text-white text-6xl font-bold">
              {displayWeight}
            </Text>

            <Text className="text-zinc-400 text-lg mt-2">
              {unit}
            </Text>

            <View className="flex-row items-center mt-8">
              <TouchableOpacity
                onPress={decrease}
                className="h-14 w-14 rounded-full border border-zinc-700 items-center justify-center"
              >
                <Text className="text-white text-3xl">−</Text>
              </TouchableOpacity>

              <View className="w-16" />

              <TouchableOpacity
                onPress={increase}
                className="h-14 w-14 rounded-full border border-zinc-700 items-center justify-center"
              >
                <Text className="text-white text-3xl">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Unit Toggle */}
          <View className="flex-row mt-8 rounded-2xl border border-zinc-800 overflow-hidden">
            <TouchableOpacity
              onPress={() => setUnit("kg")}
              className={`px-8 py-3 ${
                unit === "kg" ? "bg-zinc-800" : "bg-transparent"
              }`}
            >
              <Text
                className={`font-semibold ${
                  unit === "kg"
                    ? "text-white"
                    : "text-zinc-500"
                }`}
              >
                kg
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setUnit("lbs")}
              className={`px-8 py-3 ${
                unit === "lbs" ? "bg-zinc-800" : "bg-transparent"
              }`}
            >
              <Text
                className={`font-semibold ${
                  unit === "lbs"
                    ? "text-white"
                    : "text-zinc-500"
                }`}
              >
                lbs
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleContinue}
          className="bg-yellow-600 rounded-2xl py-4 items-center mb-6"
        >
          <Text className="text-black font-bold text-lg">
            Continue
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}