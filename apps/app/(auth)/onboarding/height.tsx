// app/(auth)/onboarding/height.tsx
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from "react-native";
import { useState, useRef, useCallback, useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useOnboarding } from "@/lib/onboarding-store";
import { ProgressBar } from "./gender";

const MIN_CM = 140;
const MAX_CM = 220;
const ITEM_H = 48;
const VISIBLE_ITEMS = 5;
const SIDE_ITEMS = Math.floor(VISIBLE_ITEMS / 2); // 2
const PICKER_H = ITEM_H * VISIBLE_ITEMS;
const INITIAL_CM = 175;

const heights = Array.from({ length: MAX_CM - MIN_CM + 1 }, (_, i) => MIN_CM + i);
const INITIAL_IDX = heights.indexOf(INITIAL_CM);

type Unit = "cm" | "ft";

function cmToFtIn(cm: number): string {
  const totalIn = Math.round(cm / 2.54);
  const ft = Math.floor(totalIn / 12);
  const inches = totalIn % 12;
  return `${ft}' ${inches}"`;
}

// Opacity/scale based on distance from center
function getItemStyle(distance: number) {
  switch (distance) {
    case 0:
      return { opacity: 1, fontSize: 26, fontWeight: "800" as const, color: "#ffffff" };
    case 1:
      return { opacity: 0.55, fontSize: 20, fontWeight: "600" as const, color: "#ffffff" };
    case 2:
      return { opacity: 0.2, fontSize: 17, fontWeight: "400" as const, color: "#ffffff" };
    default:
      return { opacity: 0, fontSize: 15, fontWeight: "400" as const, color: "#ffffff" };
  }
}

export default function HeightScreen() {
  const { set } = useOnboarding();
  const [unit, setUnit] = useState<Unit>("cm");
  const [selectedIdx, setSelectedIdx] = useState(INITIAL_IDX);
  const selectedIdxRef = useRef(INITIAL_IDX);
  const lastHapticIdxRef = useRef(INITIAL_IDX);
  const scrollRef = useRef<ScrollView>(null);
  const isScrollingRef = useRef(false);

  // Scroll to initial position on mount
  useEffect(() => {
    const offset = INITIAL_IDX * ITEM_H;
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: offset, animated: false });
    }, 50);
  }, []);

  function displayValue(cm: number) {
    return unit === "cm" ? `${cm} cm` : cmToFtIn(cm);
  }

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const idx = Math.round(offsetY / ITEM_H);
    const clamped = Math.max(0, Math.min(idx, heights.length - 1));

    if (clamped !== selectedIdxRef.current) {
      selectedIdxRef.current = clamped;
      setSelectedIdx(clamped);

      // Haptic tick on each new item
      if (clamped !== lastHapticIdxRef.current) {
        lastHapticIdxRef.current = clamped;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  }, []);

  const onMomentumScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const idx = Math.round(offsetY / ITEM_H);
    const clamped = Math.max(0, Math.min(idx, heights.length - 1));
    // Snap precisely
    scrollRef.current?.scrollTo({ y: clamped * ITEM_H, animated: true });
    selectedIdxRef.current = clamped;
    setSelectedIdx(clamped);
    isScrollingRef.current = false;
  }, []);

  const onScrollBeginDrag = useCallback(() => {
    isScrollingRef.current = true;
  }, []);

  function handleContinue() {
    set({ height: heights[selectedIdx] });
    router.push("/(auth)/onboarding/weight");
  }

  const handleUnitChange = useCallback(
    (newUnit: Unit) => {
      setUnit(newUnit);
    },
    []
  );

  return (
    <View style={S.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={S.safe}>
        <ProgressBar step={2} total={5} />

        <Text style={S.heading}>Your Height</Text>
        <Text style={S.sub}>Scroll to set your height.</Text>

        <View style={S.centerArea}>
          <View style={S.pickerOuter}>
            {/* Gold selection band — behind scroll content */}
            <View style={S.selectionBar} pointerEvents="none" />

            <ScrollView
              ref={scrollRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_H}
              decelerationRate={Platform.OS === "ios" ? "fast" : 0.9}
              scrollEventThrottle={16}
              onScroll={onScroll}
              onMomentumScrollEnd={onMomentumScrollEnd}
              onScrollBeginDrag={onScrollBeginDrag}
              contentContainerStyle={{
                paddingTop: ITEM_H * SIDE_ITEMS,
                paddingBottom: ITEM_H * SIDE_ITEMS,
              }}
              bounces={false}
              overScrollMode="never"
            >
              {heights.map((cm, idx) => {
                const distance = Math.abs(idx - selectedIdx);
                const style = getItemStyle(distance);
                return (
                  <View key={cm} style={S.itemRow}>
                    <Text
                      style={[
                        S.itemText,
                        {
                          opacity: style.opacity,
                          fontSize: style.fontSize,
                          fontWeight: style.fontWeight,
                          color: style.color,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {displayValue(cm)}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            {/* Fade masks */}
            <LinearGradient
              colors={["#0a0a0a", "rgba(10,10,10,0.85)", "transparent"]}
              locations={[0, 0.4, 1]}
              style={S.fadeTop}
              pointerEvents="none"
            />
            <LinearGradient
              colors={["transparent", "rgba(10,10,10,0.85)", "#0a0a0a"]}
              locations={[0, 0.6, 1]}
              style={S.fadeBot}
              pointerEvents="none"
            />
          </View>

          <Text style={S.valueLabel}>{displayValue(heights[selectedIdx])}</Text>

          {/* cm / ft toggle */}
          <View style={S.unitToggle}>
            <TouchableOpacity
              onPress={() => handleUnitChange("cm")}
              style={[S.unitBtn, unit === "cm" && S.unitBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[S.unitText, unit === "cm" && S.unitTextActive]}>cm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleUnitChange("ft")}
              style={[S.unitBtn, unit === "ft" && S.unitBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[S.unitText, unit === "ft" && S.unitTextActive]}>ft / in</Text>
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

const S: Record<string, any> = {
  root: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
  },
  heading: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  sub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 15,
  },
  centerArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Picker ─────────────────────────────────────────────────────────
  pickerOuter: {
    height: PICKER_H,
    width: 240,
    overflow: "hidden",
    position: "relative",
  },
  selectionBar: {
    position: "absolute",
    top: ITEM_H * SIDE_ITEMS,
    left: 8,
    right: 8,
    height: ITEM_H,
    backgroundColor: "rgba(202,138,4,0.10)",
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: "#ca8a04",
    borderRadius: 12,
    zIndex: 2,
  },
  itemRow: {
    height: ITEM_H,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    textAlign: "center",
  },
  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_H * SIDE_ITEMS,
    zIndex: 3,
  },
  fadeBot: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_H * SIDE_ITEMS,
    zIndex: 3,
  },

  // ── Value label ────────────────────────────────────────────────────
  valueLabel: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 13,
    marginTop: 18,
    letterSpacing: 0.5,
  },

  // ── Unit toggle ────────────────────────────────────────────────────
  unitToggle: {
    flexDirection: "row",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 10,
    overflow: "hidden",
  },
  unitBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  unitBtnActive: {
    backgroundColor: "rgba(202,138,4,0.15)",
  },
  unitText: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 13,
    fontWeight: "600",
  },
  unitTextActive: {
    color: "#ca8a04",
  },

  // ── CTA ────────────────────────────────────────────────────────────
  cta: {
    backgroundColor: "#ca8a04",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 24,
  },
  ctaText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 17,
  },
};