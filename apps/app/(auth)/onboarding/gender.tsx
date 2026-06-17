// app/(auth)/onboarding/gender.tsx
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";

const genders = [
  { label: "Male", emoji: "♂️" },
  { label: "Female", emoji: "♀️" },
  { label: "Other", emoji: "⚧" },
];

export default function GenderScreen() {
  const { set } = useOnboarding();
  const [selected, setSelected] = useState<string | null>(null);

  function handleContinue() {
    if (!selected) return;
    set({ gender: selected });
    router.push("/(auth)/onboarding/height");
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24 }}>
        <ProgressBar step={1} total={5} />

        <Text style={S.heading}>What's your gender?</Text>
        <Text style={S.sub}>This helps us personalize your plan.</Text>

        <View style={{ flex: 1, justifyContent: "center", gap: 14 }}>
          {genders.map(({ label, emoji }) => (
            <TouchableOpacity
              key={label}
              onPress={() => setSelected(label)}
              style={[S.option, selected === label && S.optionSelected]}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 24 }}>{emoji}</Text>
              <Text style={[S.optionText, selected === label && { color: "#ca8a04" }]}>
                {label}
              </Text>
              {selected === label && (
                <View style={S.check}><Text style={{ color: "#000", fontWeight: "800" }}>✓</Text></View>
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

export function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 6, marginTop: 16, marginBottom: 40 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 99,
            backgroundColor: i < step ? "#ca8a04" : "rgba(255,255,255,0.12)",
          }}
        />
      ))}
    </View>
  );
}

const S: Record<string, any> = {
  heading: { color: "#fff", fontSize: 30, fontWeight: "800", marginBottom: 6, letterSpacing: -0.3 },
  sub: { color: "rgba(255,255,255,0.45)", fontSize: 15, marginBottom: 8 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 20,
  },
  optionSelected: { borderColor: "#ca8a04", backgroundColor: "rgba(202,138,4,0.08)" },
  optionText: { color: "#fff", fontSize: 17, fontWeight: "600", flex: 1 },
  check: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: "#ca8a04",
    alignItems: "center", justifyContent: "center",
  },
  cta: {
    backgroundColor: "#ca8a04",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 24,
  },
  ctaText: { color: "#000", fontWeight: "800", fontSize: 17 },
};