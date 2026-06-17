// app/(auth)/onboarding/goal.tsx
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "@/lib/onboarding-store";
import { ProgressBar } from "./gender";

const goals = [
  { label: "Lose Weight", emoji: "🔥", desc: "Burn fat and slim down" },
  { label: "Build Muscle", emoji: "💪", desc: "Gain strength and size" },
  { label: "Stay Fit", emoji: "⚡", desc: "Maintain current fitness" },
  { label: "Improve Health", emoji: "❤️", desc: "Live healthier overall" },
];

export default function GoalScreen() {
  const { set } = useOnboarding();
  const [selected, setSelected] = useState<string | null>(null);

  function handleContinue() {
    if (!selected) return;
    set({ goal: selected });
    router.push("/(auth)/onboarding/activity-level");
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24 }}>
        <ProgressBar step={4} total={5} />

        <Text style={S.heading}>What's your goal?</Text>
        <Text style={S.sub}>Select your primary fitness goal.</Text>

        <View style={{ flex: 1, justifyContent: "center", gap: 14 }}>
          {goals.map(({ label, emoji, desc }) => (
            <TouchableOpacity
              key={label}
              onPress={() => setSelected(label)}
              style={[S.option, selected === label && S.optionSelected]}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 28 }}>{emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[S.optionLabel, selected === label && { color: "#ca8a04" }]}>{label}</Text>
                <Text style={S.optionDesc}>{desc}</Text>
              </View>
              {selected === label && (
                <View style={S.check}><Text style={{ color: "#000", fontWeight: "800", fontSize: 12 }}>✓</Text></View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selected}
          style={[S.cta, !selected && { opacity: 0.4 }]}
        >
          <Text style={S.ctaText}>Continue</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const S: Record<string, any> = {
  heading: { color: "#fff", fontSize: 30, fontWeight: "800", marginBottom: 6 },
  sub: { color: "rgba(255,255,255,0.45)", fontSize: 15 },
  option: {
    flexDirection: "row", alignItems: "center", gap: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 20, padding: 18,
  },
  optionSelected: { borderColor: "#ca8a04", backgroundColor: "rgba(202,138,4,0.08)" },
  optionLabel: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 2 },
  optionDesc: { color: "rgba(255,255,255,0.4)", fontSize: 13 },
  check: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: "#ca8a04",
    alignItems: "center", justifyContent: "center",
  },
  cta: { backgroundColor: "#ca8a04", borderRadius: 18, paddingVertical: 18, alignItems: "center", marginBottom: 24 },
  ctaText: { color: "#000", fontWeight: "800", fontSize: 17 },
};