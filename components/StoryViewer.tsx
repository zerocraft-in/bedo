import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  PanResponder,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const STORY_DURATION = 5000; // ms per story slide

// ── Story data ────────────────────────────────────────────────────────────────
export type StoryUser = {
  id: string;
  username: string;
  avatarEmoji: string;
  avatarBg: string;
  slides: StorySlide[];
};

export type StorySlide = {
  bg: string;
  emoji: string;
  caption: string;
  time: string;
};

export const STORY_DATA: StoryUser[] = [
  {
    id: "you",
    username: "Your Story",
    avatarEmoji: "👤",
    avatarBg: "#2C2C2E",
    slides: [
      { bg: "#1a1a2e", emoji: "🏋️", caption: "Morning grind 💪", time: "2m ago" },
      { bg: "#16213e", emoji: "🥗", caption: "Post-workout fuel 🥗", time: "1m ago" },
    ],
  },
  {
    id: "alex",
    username: "alex_lifts",
    avatarEmoji: "🦾",
    avatarBg: "#3A1C1C",
    slides: [
      { bg: "#2d1b1b", emoji: "🏃", caption: "10K PR today! 🔥", time: "5m ago" },
      { bg: "#1b2d1b", emoji: "🏅", caption: "New personal best!", time: "4m ago" },
      { bg: "#1b1b2d", emoji: "😤", caption: "No days off 💯", time: "3m ago" },
    ],
  },
  {
    id: "maya",
    username: "maya.yoga",
    avatarEmoji: "🧘",
    avatarBg: "#1C1C3A",
    slides: [
      { bg: "#0d1b2a", emoji: "🌅", caption: "Sunrise flow 🌸", time: "12m ago" },
      { bg: "#1a0d2a", emoji: "✨", caption: "Find your balance", time: "10m ago" },
    ],
  },
  {
    id: "coach",
    username: "CoachMike",
    avatarEmoji: "🎯",
    avatarBg: "#1C3A1C",
    slides: [
      { bg: "#1a2e1a", emoji: "📋", caption: "New program drop 🚀", time: "20m ago" },
      { bg: "#2e1a1a", emoji: "💡", caption: "Tip: sleep is gains", time: "18m ago" },
      { bg: "#1a1a2e", emoji: "🏆", caption: "Client result: -12kg!", time: "15m ago" },
    ],
  },
  {
    id: "sam",
    username: "sam_runs",
    avatarEmoji: "🏃",
    avatarBg: "#3A2A1C",
    slides: [
      { bg: "#2a1a0d", emoji: "🌄", caption: "Trail run Sunday 🌿", time: "1h ago" },
    ],
  },
  {
    id: "fit",
    username: "FitFam",
    avatarEmoji: "💪",
    avatarBg: "#2A1C3A",
    slides: [
      { bg: "#1d0f2e", emoji: "🎵", caption: "Workout playlist drop 🎧", time: "2h ago" },
      { bg: "#0f1d2e", emoji: "🏋️", caption: "Chest day essentials", time: "1h ago" },
    ],
  },
];

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({
  isActive,
  isCompleted,
  isPaused,
  duration,
  onComplete,
}: {
  isActive: boolean;
  isCompleted: boolean;
  isPaused: boolean;
  duration: number;
  onComplete: () => void;
}) {
  const anim = useRef(new Animated.Value(isCompleted ? 1 : 0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isCompleted) {
      anim.setValue(1);
      return;
    }
    if (!isActive) {
      anim.setValue(0);
      return;
    }
    anim.setValue(0);
    const run = () => {
      animRef.current = Animated.timing(anim, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      });
      animRef.current.start(({ finished }) => {
        if (finished) onComplete();
      });
    };
    run();
    return () => animRef.current?.stop();
  }, [isActive, isCompleted]);

  useEffect(() => {
    if (!isActive) return;
    if (isPaused) {
      animRef.current?.stop();
    } else {
      // resume from current value
      const currentVal: number = (anim as any)._value ?? 0;
      const remaining = (1 - currentVal) * duration;
      animRef.current = Animated.timing(anim, {
        toValue: 1,
        duration: remaining,
        useNativeDriver: false,
      });
      animRef.current.start(({ finished }) => {
        if (finished) onComplete();
      });
    }
  }, [isPaused]);

  return (
    <View className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden mx-0.5">
      <Animated.View
        className="h-full bg-white rounded-full"
        style={{ width: anim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }}
      />
    </View>
  );
}

// ── Story Slide Background ────────────────────────────────────────────────────
function SlideBackground({ slide }: { slide: StorySlide }) {
  return (
    <View className="absolute inset-0 items-center justify-center" style={{ backgroundColor: slide.bg }}>
      {/* Gradient overlay feel via layered views */}
      <View className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.15)" }} />
      <Text style={{ fontSize: 120, opacity: 0.9 }}>{slide.emoji}</Text>
    </View>
  );
}

// ── Main StoryViewer ──────────────────────────────────────────────────────────
export default function StoryViewer() {
  const params = useLocalSearchParams<{ userId: string; startIndex: string }>();
  const startUserIdx = STORY_DATA.findIndex((u) => u.id === params.userId);
  const [userIdx, setUserIdx] = useState(Math.max(startUserIdx, 0));
  const [slideIdx, setSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visible, setVisible] = useState(true);

  const user = STORY_DATA[userIdx];
  const totalSlides = user.slides.length;
  const slide = user.slides[slideIdx];

  // Slide-level fade-in
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goToSlide = useCallback(
    (nextSlide: number) => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.4, duration: 80, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
      setSlideIdx(nextSlide);
    },
    [fadeAnim]
  );

  const goNextSlide = useCallback(() => {
    if (slideIdx < totalSlides - 1) {
      goToSlide(slideIdx + 1);
    } else {
      // Next user
      if (userIdx < STORY_DATA.length - 1) {
        setUserIdx((u) => u + 1);
        setSlideIdx(0);
      } else {
        close();
      }
    }
  }, [slideIdx, totalSlides, userIdx]);

  const goPrevSlide = useCallback(() => {
    if (slideIdx > 0) {
      goToSlide(slideIdx - 1);
    } else {
      if (userIdx > 0) {
        setUserIdx((u) => u - 1);
        setSlideIdx(0);
      }
    }
  }, [slideIdx, userIdx]);

  const close = () => router.back();

  // Pan responder for swipe down to close
  const panY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 10 && Math.abs(gs.dy) > Math.abs(gs.dx),
      onPanResponderGrant: () => setIsPaused(true),
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) panY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 100) {
          Animated.timing(panY, { toValue: SCREEN_H, duration: 250, useNativeDriver: true }).start(close);
        } else {
          Animated.spring(panY, { toValue: 0, useNativeDriver: true }).start();
          setIsPaused(false);
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden />
      <Animated.View
        className="flex-1"
        style={{ transform: [{ translateY: panY }] }}
        {...panResponder.panHandlers}
      >
        {/* Background slide */}
        <Animated.View className="flex-1" style={{ opacity: fadeAnim }}>
          <SlideBackground slide={slide} />
        </Animated.View>

        {/* UI Overlay */}
        <View className="absolute inset-0">
          <SafeAreaView className="flex-1">
            {/* Progress bars */}
            <View className="flex-row px-2 pt-2 pb-3">
              {user.slides.map((_, i) => (
                <ProgressBar
                  key={`${userIdx}-${i}`}
                  isActive={i === slideIdx}
                  isCompleted={i < slideIdx}
                  isPaused={isPaused}
                  duration={STORY_DURATION}
                  onComplete={goNextSlide}
                />
              ))}
            </View>

            {/* Header */}
            <View className="flex-row items-center px-4 mb-4">
              <View
                className="w-9 h-9 rounded-full items-center justify-center mr-3 border-2 border-white"
                style={{ backgroundColor: user.avatarBg }}
              >
                <Text style={{ fontSize: 18 }}>{user.avatarEmoji}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-[14px]">{user.username}</Text>
                <Text className="text-white/60 text-xs mt-0.5">{slide.time}</Text>
              </View>
              {/* Pause/play hint */}
              <TouchableOpacity onPress={close} className="w-8 h-8 items-center justify-center">
                <Text className="text-white text-xl font-light">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Tap zones */}
            <View className="flex-1 flex-row">
              {/* Left tap — go back */}
              <Pressable
                className="flex-1"
                onPress={goPrevSlide}
                onLongPress={() => setIsPaused(true)}
                onPressOut={() => setIsPaused(false)}
                delayLongPress={200}
              />
              {/* Right tap — go forward */}
              <Pressable
                className="flex-[2]"
                onPress={goNextSlide}
                onLongPress={() => setIsPaused(true)}
                onPressOut={() => setIsPaused(false)}
                delayLongPress={200}
              />
            </View>

            {/* Caption bar */}
            <View className="px-5 pb-8">
              <View
                className="rounded-2xl px-4 py-3"
                style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
              >
                <Text className="text-white font-semibold text-base">{slide.caption}</Text>
              </View>

              {/* Reply bar */}
              <View
                className="flex-row items-center mt-3 border border-white/30 rounded-2xl px-4 py-3"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <Text className="text-white/50 flex-1 text-sm">Reply to {user.username}…</Text>
                <Text className="text-white/50 text-lg ml-2">❤️</Text>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Animated.View>
    </View>
  );
}