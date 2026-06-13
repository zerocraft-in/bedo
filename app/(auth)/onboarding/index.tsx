// app/(auth)/index.tsx

import { View, Text, Image, TouchableOpacity, StatusBar } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import HeroImage from "@/components/onboarding/HeroImage";
import BackgroundGrid from "@/components/onboarding/BackgroundGrid";
import CTAButtons from "@/components/onboarding/CTAButtons";
import { LogoWordmark } from "@/assets/icons";
function BrandSection() {
  return (
    <View className="items-start mb-8">
      <LogoWordmark
        className="w-[180px] h-[36px]"
      />

      <Text className="mt-4 text-start text-base leading-6 text-white/80">
        Your AI coach for smarter training{"\n"}
        and real progress.
      </Text>
    </View>
  );
}
export default function OnboardingScreen() {
  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#180707", "#713f12", "#422006", "#180707"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      <BackgroundGrid />

      <View className="flex-1 px-8">
        <View className="flex-1 justify-center items-center">
          <HeroImage />
        </View>

        <View className="pb-10">
          <BrandSection />

          <CTAButtons />
        </View>
      </View>
    </View>
  );
}
