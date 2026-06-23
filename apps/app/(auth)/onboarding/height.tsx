// app/(auth)/onboarding/height.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useOnboarding } from "@/lib/onboarding-store";
import { ProgressBar } from "./gender";

const MIN_CM = 140;
const MAX_CM = 220;
const INITIAL_CM = 175;

type Unit = "cm" | "ft";

function cmToFtIn(cm: number) {
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;

  return `${feet}' ${inches}"`;
}

function cmToFeetInches(cm: number) {
  const totalInches = Math.round(cm / 2.54);

  return {
    feet: Math.floor(totalInches / 12),
    inches: totalInches % 12,
  };
}

function ftInToCm(feet: string, inches: string) {
  const ft = parseInt(feet) || 0;
  const inch = parseInt(inches) || 0;

  return Math.round((ft * 12 + inch) * 2.54);
}

export default function HeightScreen() {
  const { set } = useOnboarding();

  const [unit, setUnit] = useState<Unit>("cm");

  const [heightCm, setHeightCm] = useState(INITIAL_CM);
  const [cmInput, setCmInput] = useState(INITIAL_CM.toString());

  const initial = cmToFeetInches(INITIAL_CM);

  const [feet, setFeet] = useState(initial.feet.toString());
  const [inch, setInch] = useState(initial.inches.toString());

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const converted = cmToFeetInches(heightCm);

    setFeet(converted.feet.toString());
    setInch(converted.inches.toString());
    setCmInput(heightCm.toString());
  }, [heightCm]);

  const animateError = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const updateCm = (value: string) => {
    setCmInput(value);

    const num = parseInt(value);

    if (!isNaN(num) && num >= MIN_CM && num <= MAX_CM) {
      setHeightCm(num);
    }
  };

  const updateFeet = (value: string) => {
    setFeet(value);

    const cm = ftInToCm(value, inch);

    if (cm >= MIN_CM && cm <= MAX_CM) {
      setHeightCm(cm);
    }
  };

  const updateInch = (value: string) => {
    setInch(value);

    const cm = ftInToCm(feet, value);

    if (cm >= MIN_CM && cm <= MAX_CM) {
      setHeightCm(cm);
    }
  };

  const validateCmInput = () => {
    const num = parseInt(cmInput);

    if (!cmInput || isNaN(num) || num < MIN_CM || num > MAX_CM) {
      setCmInput(heightCm.toString());
    }
  };

  const handleContinue = () => {
    if (heightCm < MIN_CM || heightCm > MAX_CM) {
      animateError();

      Alert.alert(
        "Invalid Height",
        `Please enter a height between ${MIN_CM} and ${MAX_CM} cm`,
      );

      return;
    }

    set({
      height: heightCm,
    });

    router.push("/(auth)/onboarding/weight");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      <SafeAreaView
        className="flex-1 px-6"
        style={{
          flex: 1,
          paddingHorizontal: 24,
        }}
      >
        <ProgressBar step={2} total={5} />

        {/* Header */}
        <View className="mt-4 mb-10">
          <Text className="text-foreground text-4xl font-bold">
            What's your height?
          </Text>

          <Text className="text-muted-foreground mt-3 text-base">
            We'll personalize your fitness experience.
          </Text>
        </View>

        <View className="flex-1">
          {/* Unit Switch */}
          <View className="items-center mb-12">
            <View className="flex-row bg-card rounded-3xl p-1">
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setUnit("cm")}
                className={`px-8 py-3 rounded-2xl ${
                  unit === "cm" ? "bg-primary" : "bg-transparent"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    unit === "cm"
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  CM
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setUnit("ft")}
                className={`px-8 py-3 rounded-2xl ${
                  unit === "ft" ? "bg-primary" : "bg-transparent"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    unit === "ft"
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  FT / IN
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Input Area */}
          {unit === "cm" ? (
            <View className="items-center mb-12">
              <Text className="text-foreground text-7xl font-bold">
                {heightCm}
              </Text>

              <Text className="text-muted-foreground mt-2 mb-6">
                centimeters
              </Text>

              <TextInput
                value={cmInput}
                onChangeText={updateCm}
                onBlur={validateCmInput}
                keyboardType="number-pad"
                maxLength={3}
                placeholder="175"
                placeholderTextColor="#9CA3AF"
                style={{
                  height: 64,
                  width: 180,
                  borderRadius: 18,
                  textAlign: "center",
                  fontSize: 24,
                  fontWeight: "700",
                  color: "#FFFFFF",
                  backgroundColor: "rgba(255,255,255,0.07)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.12)",
                }}
              />
            </View>
          ) : (
            <View className="mb-12">
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-muted-foreground mb-2 text-sm">
                    Feet
                  </Text>

                  <TextInput
                    value={feet}
                    onChangeText={updateFeet}
                    keyboardType="number-pad"
                    maxLength={1}
                    placeholder="5"
                    placeholderTextColor="#9CA3AF"
                    style={{
                      height: 64,
                      borderRadius: 18,
                      textAlign: "center",
                      fontSize: 24,
                      fontWeight: "700",
                      color: "#FFFFFF",
                      backgroundColor: "rgba(255,255,255,0.07)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.12)",
                    }}
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-muted-foreground mb-2 text-sm">
                    Inches
                  </Text>

                  <TextInput
                    value={inch}
                    onChangeText={updateInch}
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholder="9"
                    placeholderTextColor="#9CA3AF"
                    style={{
                      height: 64,
                      borderRadius: 18,
                      textAlign: "center",
                      fontSize: 24,
                      fontWeight: "700",
                      color: "#FFFFFF",
                      backgroundColor: "rgba(255,255,255,0.07)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.12)",
                    }}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Preview Card */}
          <View className="bg-card rounded-3xl p-6 border border-border">
            <Text className="text-muted-foreground text-sm">
              Selected Height
            </Text>

            <Text className="text-foreground text-4xl font-bold mt-2">
              {heightCm} cm
            </Text>

            <Text className="text-muted-foreground mt-2 text-base">
              {cmToFtIn(heightCm)}
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}
        >
          <TouchableOpacity
            onPress={handleContinue}
            activeOpacity={0.9}
            className="
              h-14
              bg-yellow-600
              rounded-2xl
              items-center
              justify-center
              mb-6
            "
          >
            <Text className="text-primary-foreground text-base font-bold">
              Continue
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
