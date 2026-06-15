// /(tabs)/workouts.tsx

import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

const CATEGORIES = ["All", "Strength", "Cardio", "HIIT", "Flexibility", "Sports"];

const FEATURED = {
  title: "Full Body Blast",
  subtitle: "45 min · 6 exercises · 480 cal",
  tag: "Today's Pick",
  color: "#FF9F0A",
  emoji: "💪",
};

const WORKOUTS = [
  { emoji: "🏋️", title: "Upper Body Power", sub: "32 min · 8 exercises", cal: 310, level: "Intermediate", color: "#FF9F0A", cat: "Strength" },
  { emoji: "🦵", title: "Leg Day", sub: "40 min · 10 exercises", cal: 380, level: "Advanced", color: "#FF375F", cat: "Strength" },
  { emoji: "🏃", title: "5K Runner Prep", sub: "30 min · Intervals", cal: 290, level: "Beginner", color: "#30D158", cat: "Cardio" },
  { emoji: "⚡", title: "HIIT Tabata", sub: "20 min · High intensity", cal: 350, level: "Advanced", color: "#FF375F", cat: "HIIT" },
  { emoji: "🚴", title: "Cycling Endurance", sub: "45 min · Steady pace", cal: 420, level: "Intermediate", color: "#0A84FF", cat: "Cardio" },
  { emoji: "🧘", title: "Morning Yoga", sub: "25 min · Vinyasa flow", cal: 140, level: "Beginner", color: "#BF5AF2", cat: "Flexibility" },
  { emoji: "🤸", title: "Core & Stretch", sub: "20 min · Pilates blend", cal: 160, level: "Beginner", color: "#64D2FF", cat: "Flexibility" },
  { emoji: "⛹️", title: "Basketball Drills", sub: "35 min · Agility", cal: 330, level: "Intermediate", color: "#FF9F0A", cat: "Sports" },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "#30D158",
  Intermediate: "#FF9F0A",
  Advanced: "#FF375F",
};

function WorkoutCard({ emoji, title, sub, cal, level, color }: {
  emoji: string; title: string; sub: string; cal: number; level: string; color: string;
}) {
  return (
    <TouchableOpacity activeOpacity={0.75} className="bg-[#1C1C1E] rounded-2xl p-4 mb-3">
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4" style={{ backgroundColor: color + "20" }}>
          <Text style={{ fontSize: 24 }}>{emoji}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-white font-semibold text-[15px]">{title}</Text>
          <Text className="text-[#8E8E93] text-sm mt-0.5">{sub}</Text>
          <View className="flex-row items-center mt-1.5 gap-x-2">
            <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: LEVEL_COLORS[level] + "25" }}>
              <Text className="text-xs font-semibold" style={{ color: LEVEL_COLORS[level] }}>{level}</Text>
            </View>
          </View>
        </View>
        <View className="items-end">
          <Text className="font-bold text-base" style={{ color }}>{cal}</Text>
          <Text className="text-[#636366] text-xs">CAL</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function WorkoutsScreen() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = WORKOUTS.filter(
    (w) => activeCategory === "All" || w.cat === activeCategory
  );

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

          {/* Header */}
          <View className="px-5 pt-3 pb-5">
            <Text className="text-[#8E8E93] text-sm">Ready to train?</Text>
            <Text className="text-white text-[28px] font-bold tracking-tight mt-0.5">Workouts</Text>
          </View>

          {/* Featured Banner */}
          <TouchableOpacity activeOpacity={0.85} className="mx-4 mb-5 rounded-3xl overflow-hidden">
            <View className="p-5" style={{ backgroundColor: FEATURED.color + "22", borderWidth: 1, borderColor: FEATURED.color + "40", borderRadius: 24 }}>
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <View className="self-start px-2.5 py-1 rounded-full mb-3" style={{ backgroundColor: FEATURED.color }}>
                    <Text className="text-black text-xs font-bold">{FEATURED.tag}</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold">{FEATURED.title}</Text>
                  <Text className="text-[#8E8E93] text-sm mt-1">{FEATURED.subtitle}</Text>
                  <TouchableOpacity activeOpacity={0.8} className="mt-4 self-start px-5 py-2.5 rounded-full" style={{ backgroundColor: FEATURED.color }}>
                    <Text className="text-black font-bold text-sm">Start Now</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 64 }}>{FEATURED.emoji}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Category Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4" contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.7}
                onPress={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full"
                style={{ backgroundColor: activeCategory === cat ? "#FF9F0A" : "#1C1C1E" }}
              >
                <Text className="font-semibold text-sm" style={{ color: activeCategory === cat ? "#000" : "#8E8E93" }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Workout List */}
          <View className="px-4">
            <Text className="text-[#636366] text-xs uppercase tracking-wider font-semibold mb-3">
              {filtered.length} workouts
            </Text>
            {filtered.map((w, i) => <WorkoutCard key={i} {...w} />)}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}