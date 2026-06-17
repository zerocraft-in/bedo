// app/(auth)/onboarding/activity-level.tsx
// Final onboarding step — shows confetti burst on completion, then navigates.
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { useState, useRef, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "@/lib/onboarding-store";
import { ProgressBar } from "./gender";

const { width: W, height: H } = Dimensions.get("window");

const levels = [
  { label: "Sedentary",         emoji: "🛋️", desc: "Little or no exercise" },
  { label: "Lightly Active",    emoji: "🚶", desc: "Light exercise 1–3 days/week" },
  { label: "Moderately Active", emoji: "🏃", desc: "Exercise 3–5 days/week" },
  { label: "Very Active",       emoji: "🏋️", desc: "Hard exercise 6–7 days/week" },
];

// ─── Confetti config ──────────────────────────────────────────────────────────
const COLORS = ["#ca8a04", "#f59e0b", "#fbbf24", "#ffffff", "#fb923c", "#fdba74"];
const SHAPES = ["square", "circle", "rect"] as const;
const COUNT  = 80;

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  rot: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  color: string;
  shape: typeof SHAPES[number];
  size: number;
}

function makeParticles(): Particle[] {
  return Array.from({ length: COUNT }, () => ({
    x:       new Animated.Value(0),
    y:       new Animated.Value(0),
    rot:     new Animated.Value(0),
    scale:   new Animated.Value(0),
    opacity: new Animated.Value(1),
    color:   COLORS[Math.floor(Math.random() * COLORS.length)],
    shape:   SHAPES[Math.floor(Math.random() * SHAPES.length)],
    size:    6 + Math.random() * 8,
  }));
}

function useConfetti() {
  const particles = useRef<Particle[]>(makeParticles()).current;
  const running   = useRef(false);

  const burst = useCallback(() => {
    if (running.current) return;
    running.current = true;

    // Reset all particles
    particles.forEach((p) => {
      p.x.setValue(0);
      p.y.setValue(0);
      p.rot.setValue(0);
      p.scale.setValue(0);
      p.opacity.setValue(1);
    });

    const anims = particles.map((p) => {
      const angle  = (Math.random() * 2 - 1) * Math.PI;       // full 360°
      const dist   = W * 0.4 + Math.random() * W * 0.35;
      const dx     = Math.cos(angle) * dist;
      const dy     = -(Math.random() * H * 0.55 + H * 0.05);  // always upward first
      const delay  = Math.random() * 120;
      const dur    = 900 + Math.random() * 500;

      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.spring(p.scale, {
            toValue: 1,
            friction: 6,
            tension: 120,
            useNativeDriver: true,
          }),
          Animated.timing(p.x, {
            toValue: dx,
            duration: dur,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(p.y, {
            toValue: dy + H * 0.6, // arc down after going up
            duration: dur,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(p.rot, {
            toValue: (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 4),
            duration: dur,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(dur * 0.55),
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: dur * 0.45,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]);
    });

    Animated.parallel(anims).start(() => {
      running.current = false;
    });
  }, [particles]);

  return { particles, burst };
}

// ─── Particle shape ───────────────────────────────────────────────────────────
function Piece({ p }: { p: Particle }) {
  const spin = p.rot.interpolate({
    inputRange: [-10, 10],
    outputRange: ["-3600deg", "3600deg"],
  });

  const shapeStyle =
    p.shape === "circle"
      ? { borderRadius: p.size / 2, width: p.size, height: p.size }
      : p.shape === "rect"
      ? { width: p.size * 0.5, height: p.size * 1.6, borderRadius: 2 }
      : { width: p.size, height: p.size, borderRadius: 2 };

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: W / 2,
        top: H * 0.55,
        transform: [
          { translateX: p.x },
          { translateY: p.y },
          { rotate: spin },
          { scale: p.scale },
        ],
        opacity: p.opacity,
        backgroundColor: p.color,
        ...shapeStyle,
      }}
    />
  );
}

// ─── Celebration overlay ──────────────────────────────────────────────────────
function CelebrationOverlay({
  visible,
  onDone,
}: {
  visible: boolean;
  onDone: () => void;
}) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const { particles, burst } = useConfetti();

  useEffect(() => {
    if (!visible) return;

    burst();

    Animated.parallel([
      Animated.spring(fadeAnim,  { toValue: 1, friction: 8, tension: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 100, useNativeDriver: true }),
    ]).start();

    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute", inset: 0,
        alignItems: "center", justifyContent: "center",
        zIndex: 99,
      }}
      pointerEvents="none"
    >
      {/* Dim background */}
      <Animated.View
        style={{
          position: "absolute", inset: 0,
          backgroundColor: "rgba(0,0,0,0.75)",
          opacity: fadeAnim,
        }}
      />

      {/* Confetti particles */}
      {particles.map((p, i) => <Piece key={i} p={p} />)}

      {/* Card */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          backgroundColor: "#111",
          borderWidth: 1,
          borderColor: "rgba(202,138,4,0.35)",
          borderRadius: 28,
          paddingVertical: 40,
          paddingHorizontal: 36,
          alignItems: "center",
          width: W * 0.82,
        }}
      >
        <Text style={{ fontSize: 64, marginBottom: 16 }}>🎉</Text>
        <Text style={{
          color: "#fff", fontSize: 26, fontWeight: "800",
          letterSpacing: -0.4, textAlign: "center", marginBottom: 8,
        }}>
          You're all set!
        </Text>
        <Text style={{
          color: "rgba(255,255,255,0.5)", fontSize: 15,
          textAlign: "center", lineHeight: 22,
        }}>
          Your personalized plan is{"\n"}ready. Let's get to work.
        </Text>

        {/* Gold accent line */}
        <View style={{
          marginTop: 24, height: 3, width: 48,
          backgroundColor: "#ca8a04", borderRadius: 99,
        }} />
      </Animated.View>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function ActivityLevelScreen() {
  const { set, finish } = useOnboarding();
  const [selected, setSelected]     = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
  const [showCelebration, setShow]  = useState(false);

  async function handleFinish() {
    if (!selected || loading) return;
    set({ activityLevel: selected });
    setLoading(true);
    try {
      // Show confetti first, finish() called after animation
      setShow(true);
    } catch {
      setLoading(false);
    }
  }

  async function handleCelebrationDone() {
    await finish(); // navigates to (tabs)
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24 }}>
        <ProgressBar step={5} total={5} />

        <Text style={S.heading}>Activity Level</Text>
        <Text style={S.sub}>How active are you on a typical day?</Text>

        <View style={{ flex: 1, justifyContent: "center", gap: 14 }}>
          {levels.map(({ label, emoji, desc }) => (
            <TouchableOpacity
              key={label}
              onPress={() => setSelected(label)}
              style={[S.option, selected === label && S.optionSelected]}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 26 }}>{emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[S.optionLabel, selected === label && { color: "#ca8a04" }]}>
                  {label}
                </Text>
                <Text style={S.optionDesc}>{desc}</Text>
              </View>
              {selected === label && (
                <View style={S.check}>
                  <Text style={{ color: "#000", fontWeight: "800", fontSize: 12 }}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleFinish}
          disabled={!selected || loading}
          style={[S.cta, (!selected || loading) && { opacity: 0.4 }]}
          activeOpacity={0.85}
        >
          <Text style={S.ctaText}>
            {loading ? "Almost there…" : "Finish — Let's Go 🚀"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

      <CelebrationOverlay
        visible={showCelebration}
        onDone={handleCelebrationDone}
      />
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
    backgroundColor: "#ca8a04", alignItems: "center", justifyContent: "center",
  },
  cta: {
    backgroundColor: "#ca8a04", borderRadius: 18,
    paddingVertical: 18, alignItems: "center", marginBottom: 24,
  },
  ctaText: { color: "#000", fontWeight: "800", fontSize: 17 },
};