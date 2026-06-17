// app/(auth)/onboarding/weight.tsx
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useState, useRef, useCallback } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useOnboarding } from "@/lib/onboarding-store";
import { ProgressBar } from "./gender";

const MIN_KG = 30;
const MAX_KG = 200;
const ITEM_H = 56;
const PAD = 2;
const INITIAL_KG = 70;

const weights = Array.from({ length: MAX_KG - MIN_KG + 1 }, (_, i) => MIN_KG + i);
const PADDED = [...Array(PAD).fill(null), ...weights, ...Array(PAD).fill(null)];

type Unit = "kg" | "lbs";

export default function WeightScreen() {
  const { set } = useOnboarding();
  const [unit, setUnit] = useState<Unit>("kg");

  const selectedIdxRef = useRef(weights.indexOf(INITIAL_KG));
  const [selectedIdx, setSelectedIdx] = useState(weights.indexOf(INITIAL_KG));

  const listRef = useRef<FlatList>(null);

  function displayValue(kg: number) {
    if (unit === "kg") return `${kg} kg`;
    return `${Math.round(kg * 2.205)} lbs`;
  }

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const idx = Math.round(offsetY / ITEM_H);
      const clamped = Math.max(0, Math.min(idx, weights.length - 1));
      if (clamped !== selectedIdxRef.current) {
        selectedIdxRef.current = clamped;
        setSelectedIdx(clamped);
      }
    },
    []
  );

  function handleContinue() {
    set({ weight: weights[selectedIdx] });
    router.push("/(auth)/onboarding/goal");
  }

  const renderItem = useCallback(
    ({ item, index }: { item: number | null; index: number }) => {
      if (item === null) return <View style={{ height: ITEM_H }} />;
      const weightsIdx = index - PAD;
      const diff = Math.abs(weightsIdx - selectedIdx);
      const isActive = diff === 0;
      const isNear = diff === 1;
      return (
        <View style={{ height: ITEM_H, justifyContent: "center", alignItems: "center" }}>
          <Text style={[S.pickerItem, isNear && S.pickerItemNear, isActive && S.pickerItemActive]}>
            {displayValue(item)}
          </Text>
        </View>
      );
    },
    [selectedIdx, unit]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({ length: ITEM_H, offset: ITEM_H * index, index }),
    []
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24 }}>
        <ProgressBar step={3} total={5} />

        <Text style={S.heading}>Your Weight</Text>
        <Text style={S.sub}>Scroll to set your current weight.</Text>

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={S.pickerOuter}>
            <View style={S.selectionBar} pointerEvents="none" />

            <FlatList
              ref={listRef}
              data={PADDED}
              keyExtractor={(_, i) => String(i)}
              renderItem={renderItem}
              getItemLayout={getItemLayout}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_H}
              decelerationRate="fast"
              scrollEventThrottle={16}
              onScroll={onScroll}
              initialScrollIndex={weights.indexOf(INITIAL_KG)}
              style={{ zIndex: 1 }}
            />

            <LinearGradient colors={["#0a0a0a", "transparent"]} style={S.fadeTop} pointerEvents="none" />
            <LinearGradient colors={["transparent", "#0a0a0a"]} style={S.fadeBot} pointerEvents="none" />
          </View>

          <Text style={S.valueLabel}>{displayValue(weights[selectedIdx])}</Text>

          <View style={S.unitToggle}>
            <TouchableOpacity
              onPress={() => setUnit("kg")}
              style={[S.unitBtn, unit === "kg" && S.unitBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[S.unitText, unit === "kg" && S.unitTextActive]}>kg</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setUnit("lbs")}
              style={[S.unitBtn, unit === "lbs" && S.unitBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[S.unitText, unit === "lbs" && S.unitTextActive]}>lbs</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={handleContinue} style={S.cta} activeOpacity={0.85}>
          <Text style={S.ctaText}>Continue</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const PICKER_H = ITEM_H * 5;

const S: Record<string, any> = {
  heading: { color: "#fff", fontSize: 30, fontWeight: "800", marginBottom: 6 },
  sub: { color: "rgba(255,255,255,0.45)", fontSize: 15 },
  pickerOuter: { height: PICKER_H, width: 220, overflow: "hidden", position: "relative" },
  selectionBar: {
    position: "absolute", top: ITEM_H * PAD, left: 10, right: 10, height: ITEM_H,
    backgroundColor: "rgba(202,138,4,0.1)",
    borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: "#ca8a04",
    borderRadius: 14, zIndex: 2,
  },
  fadeTop: { position: "absolute", top: 0, left: 0, right: 0, height: ITEM_H * 2, zIndex: 3 },
  fadeBot: { position: "absolute", bottom: 0, left: 0, right: 0, height: ITEM_H * 2, zIndex: 3 },
  pickerItem: { color: "rgba(255,255,255,0.18)", fontSize: 18, fontWeight: "400" },
  pickerItemNear: { color: "rgba(255,255,255,0.5)", fontSize: 21, fontWeight: "600" },
  pickerItemActive: { color: "#ffffff", fontSize: 26, fontWeight: "800" },
  valueLabel: { color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 18, letterSpacing: 0.5 },
  unitToggle: {
    flexDirection: "row", marginTop: 16,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 10, overflow: "hidden",
  },
  unitBtn: { paddingVertical: 8, paddingHorizontal: 20, backgroundColor: "transparent" },
  unitBtnActive: { backgroundColor: "rgba(202,138,4,0.15)" },
  unitText: { color: "rgba(255,255,255,0.35)", fontSize: 13, fontWeight: "600" },
  unitTextActive: { color: "#ca8a04" },
  cta: { backgroundColor: "#ca8a04", borderRadius: 18, paddingVertical: 18, alignItems: "center", marginBottom: 24 },
  ctaText: { color: "#000", fontWeight: "800", fontSize: 17 },
};