// /(tabs)/nutrition.tsx

import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { useRouter } from 'expo-router';
import { Button } from "@/components/ui/button";
// ── Macro Ring ───────────────────────────────────────────────────────────────
function MacroRing({ progress, color, size = 56, strokeWidth = 6 }: { progress: number; color: string; size?: number; strokeWidth?: number }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - Math.min(progress, 1));
    const c = size / 2;
    return (
        <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
            <Circle cx={c} cy={c} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" opacity={0.2} />
            <Circle cx={c} cy={c} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none"
                strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        </Svg>
    );
}

// ── Macro Card ───────────────────────────────────────────────────────────────
function MacroCard({ label, eaten, goal, unit, color }: { label: string; eaten: number; goal: number; unit: string; color: string }) {
    const progress = eaten / goal;
    return (
        <View className="flex-1 bg-[#1C1C1E] rounded-2xl p-3.5 mx-1 items-center">
            <View className="relative items-center justify-center mb-2">
                <MacroRing progress={progress} color={color} />
                <View className="absolute items-center">
                    <Text className="text-white text-xs font-bold">{Math.round(progress * 100)}%</Text>
                </View>
            </View>
            <Text className="text-white font-bold text-base">{eaten}<Text className="text-[#636366] font-normal text-xs">{unit}</Text></Text>
            <Text className="text-[#636366] text-xs mt-0.5">of {goal}{unit}</Text>
            <Text className="text-xs font-semibold mt-1.5" style={{ color }}>{label}</Text>
        </View>
    );
}

// ── Water Tracker ────────────────────────────────────────────────────────────
function WaterTracker() {
    const cups = 8;
    const filled = 5;
    return (
        <View className="mx-4 bg-[#1C1C1E] rounded-3xl p-5 mb-4">
            <View className="flex-row justify-between items-center mb-4">
                <View>
                    <Text className="text-white font-semibold">Hydration</Text>
                    <Text className="text-[#636366] text-xs mt-0.5">{filled} of {cups} glasses</Text>
                </View>
                <Text style={{ fontSize: 28 }}>💧</Text>
            </View>
            <View className="flex-row gap-x-2">
                {Array.from({ length: cups }).map((_, i) => (
                    <View key={i} className="flex-1 h-8 rounded-lg" style={{ backgroundColor: i < filled ? "#0A84FF" : "#2C2C2E" }} />
                ))}
            </View>
            <TouchableOpacity activeOpacity={0.8} className="mt-4 bg-[#0A84FF22] rounded-xl py-2.5 items-center border border-[#0A84FF40]">
                <Text className="text-[#0A84FF] font-semibold text-sm">+ Add Glass</Text>
            </TouchableOpacity>
        </View>
    );
}

// ── Meal Row ─────────────────────────────────────────────────────────────────
function MealRow({ emoji, meal, foods, cal, color }: { emoji: string; meal: string; foods: string; cal: number; color: string }) {
    return (
        <TouchableOpacity activeOpacity={0.7} className="flex-row items-center py-4 border-b border-[#2C2C2E]">
            <View className="w-11 h-11 rounded-2xl items-center justify-center mr-4" style={{ backgroundColor: color + "20" }}>
                <Text style={{ fontSize: 22 }}>{emoji}</Text>
            </View>
            <View className="flex-1">
                <Text className="text-white font-semibold text-[15px]">{meal}</Text>
                <Text className="text-[#8E8E93] text-sm mt-0.5 pr-4" numberOfLines={1}>{foods}</Text>
            </View>
            <View className="items-end">
                <Text className="font-bold" style={{ color }}>{cal}</Text>
                <Text className="text-[#636366] text-xs">kcal</Text>
            </View>
        </TouchableOpacity>
    );
}

export default function NutritionScreen() {
    const router = useRouter()
    return (
        <View className="flex-1 bg-background">
            <SafeAreaView className="flex-1">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

                    {/* Header */}
                    <View className="px-5 pt-3 pb-5 flex gap-4 items-center flex-row">
                        <Button title="Go Back" onPress={() => router.back()} size={"icon"} className="w-14 h-14" variant="outline"/>
                        <View className="">
                            <Text className="text-[#8E8E93] text-sm">Thursday, Jun 12</Text>
                            <Text className="text-white text-[28px] font-bold tracking-tight mt-0.5">Nutrition</Text>
                        </View>
                    </View>

                    {/* Calorie Summary */}
                    <View className="mx-4 bg-card rounded-3xl p-5 mb-4">
                        <Text className="text-[#636366] text-xs uppercase tracking-wider font-semibold mb-1">Calories</Text>
                        <View className="flex-row items-end mb-4">
                            <Text className="text-white text-4xl font-bold">1,840</Text>
                            <Text className="text-[#636366] text-lg mb-1 ml-1">/ 2,200 kcal</Text>
                        </View>
                        {/* Progress bar */}
                        <View className="h-2.5 bg-[#2C2C2E] rounded-full overflow-hidden">
                            <View className="h-full rounded-full bg-[#30D158]" style={{ width: "84%" }} />
                        </View>
                        <View className="flex-row justify-between mt-2">
                            <Text className="text-[#636366] text-xs">360 kcal remaining</Text>
                            <Text className="text-[#30D158] text-xs font-semibold">On track ✓</Text>
                        </View>
                    </View>

                    {/* Macros */}
                    <View className="flex-row mx-2.5 mb-4">
                        <MacroCard label="Protein" eaten={142} goal={160} unit="g" color="#FF375F" />
                        <MacroCard label="Carbs" eaten={198} goal={240} unit="g" color="#FF9F0A" />
                        <MacroCard label="Fat" eaten={58} goal={70} unit="g" color="#0A84FF" />
                    </View>

                    {/* Water */}
                    <WaterTracker />

                    {/* Meals */}
                    <View className="mx-4 bg-[#1C1C1E] rounded-3xl px-5 pt-5 pb-2 mb-4">
                        <View className="flex-row justify-between items-center mb-1">
                            <Text className="text-white font-semibold">Today's Meals</Text>
                            <Text className="text-[#0A84FF] text-sm">+ Log Meal</Text>
                        </View>
                        <MealRow emoji="🌅" meal="Breakfast" foods="Oats, banana, almond milk, protein shake" cal={480} color="#FF9F0A" />
                        <MealRow emoji="☀️" meal="Lunch" foods="Grilled chicken, brown rice, broccoli" cal={620} color="#30D158" />
                        <MealRow emoji="🍎" meal="Snack" foods="Apple, mixed nuts, Greek yogurt" cal={280} color="#FF375F" />
                        <MealRow emoji="🌙" meal="Dinner" foods="Salmon, sweet potato, spinach salad" cal={460} color="#0A84FF" />
                    </View>

                    {/* Nutrient Highlights */}
                    <View className="mx-4 bg-[#1C1C1E] rounded-3xl p-5">
                        <Text className="text-white font-semibold mb-4">Micronutrients</Text>
                        {[
                            { label: "Fiber", val: 28, goal: 35, unit: "g", color: "#30D158" },
                            { label: "Sodium", val: 1840, goal: 2300, unit: "mg", color: "#FF9F0A" },
                            { label: "Vitamin C", val: 78, goal: 90, unit: "mg", color: "#64D2FF" },
                        ].map((n) => (
                            <View key={n.label} className="mb-3.5">
                                <View className="flex-row justify-between mb-1.5">
                                    <Text className="text-[#8E8E93] text-sm">{n.label}</Text>
                                    <Text className="text-white text-sm font-medium">{n.val}<Text className="text-[#636366]"> / {n.goal}{n.unit}</Text></Text>
                                </View>
                                <View className="h-1.5 bg-[#2C2C2E] rounded-full overflow-hidden">
                                    <View className="h-full rounded-full" style={{ width: `${Math.min((n.val / n.goal) * 100, 100)}%`, backgroundColor: n.color }} />
                                </View>
                            </View>
                        ))}
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}