// /(tabs)/index.tsx

import { BellIcon } from "@/assets/icons";
import StoryStrip from "@/components/StoryStrip";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { router } from "expo-router";
const { width } = Dimensions.get("window");

// ─── Circular Progress ────────────────────────────────────────────────────────

function CircularProgress({ percent }: { percent: number }) {
  const size = 64;
  const strokeWidth = 5;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (percent / 100) * circumference;

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#E8F5E9"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#6FCF97"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
        />
      </Svg>
      <View className="items-center justify-center bg-[#6FCF97] rounded-xl" style={{ width: 52, height: 52 }}>
        <Text className="text-white font-bold text-sm">{percent}%</Text>
      </View>
    </View>
  );
}

// ─── Workout Card (recommendation row) ───────────────────────────────────────

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Cardio: { bg: "#E8F5E9", text: "#27AE60" },
  Muscle: { bg: "#FFF3E0", text: "#F2994A" },
  Strenght: { bg: "#EDE7F6", text: "#9B51E0" },
};

function WorkoutRow({
  image,
  title,
  tag,
  duration,
  level,
}: {
  image: string;
  title: string;
  tag: string;
  duration: string;
  level: string;
}) {
  const colors = TAG_COLORS[tag] ?? { bg: "#F5F5F5", text: "#333" };
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      className="flex-row items-center bg-white rounded-2xl p-3 mb-3"
      style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
    >
      {/* Placeholder image block */}
      <View
        className="rounded-xl bg-[#F0F0F0] mr-3 overflow-hidden"
        style={{ width: 64, height: 64 }}
      >
        <View className="flex-1 bg-[#E0E0E0] items-center justify-center">
          <Text style={{ fontSize: 26 }}>🏋️</Text>
        </View>
      </View>

      {/* Info */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[#1A1A1A] font-semibold text-base">{title}</Text>
          <View className="rounded-full px-3 py-0.5" style={{ backgroundColor: colors.bg }}>
            <Text className="text-xs font-medium" style={{ color: colors.text }}>{tag}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <Text className="text-[#999] text-xs">🕐</Text>
            <Text className="text-[#999] text-xs">{duration}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-[#999] text-xs">🏅</Text>
            <Text className="text-[#999] text-xs">{level}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  return (

    <View className="flex-1 bg-background ">
      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Header */}
          <View className="flex-row items-center justify-between mt-2 mb-5 px-5">
            <View>
              <Text className="text-secondary text-base">Welcome back 🙌</Text>
              <Text className="text-primary text-3xl font-bold mt-0.5">Jordan Eagle</Text>
            </View>
            {/* Notification Button */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/onboarding/index")}
              className="w-14 h-14 rounded-3xl border border-accent items-center justify-center overflow-hidden"
            >
              <BellIcon className="w-6 h-6 text-secondary" />
            </TouchableOpacity>


          </View>
          {/* Story list section */}
          <StoryStrip />

          {/* Progress Card */}
          <View className="px-5">
            <View
              className="bg-card rounded-3xl p-4 mb-6 border border-accent"
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-primary font-semibold text-lg">Progress</Text>
                <TouchableOpacity className="p-1">
                  <Text className="text-secondary text-lg">⋯</Text>
                </TouchableOpacity>
              </View>

              {/* Progress detail */}
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="self-start bg-[#E8F5E9] rounded-full px-3 py-0.5 mb-2">
                    <Text className="text-[#27AE60] text-sm font-medium">Cardio</Text>
                  </View>
                  <Text className="text-primary text-xl font-bold mb-2">Lower Body</Text>
                  <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center gap-1">
                      <Text className="text-xs">🕐</Text>
                      <Text className="text-secondary text-xs">3 hours</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-xs">🏅</Text>
                      <Text className="text-secondary text-xs">Beginner</Text>
                    </View>
                  </View>
                </View>
                <CircularProgress percent={72} />
              </View>

              {/* CTA button */}
              <TouchableOpacity
                className="bg-primary dark:bg-background rounded-2xl mt-4 flex-row items-center justify-between px-5 py-4"
                activeOpacity={0.85}
              >
                <Text className="text-background dark:text-primary font-semibold text-lg">Continue the workout</Text>
                <View className="bg-background dark:bg-primary rounded-2xl w-7 h-7 items-center justify-center">
                  <Text className="text-[#1A1A1A] text-sm font-bold">→</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>



        </ScrollView>

      </SafeAreaView>
    </View>

  );
}

