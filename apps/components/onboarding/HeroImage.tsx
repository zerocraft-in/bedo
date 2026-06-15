// components/onboarding/HeroImage.tsx

import { View, Image, Text } from "react-native";

import { IMAGES } from "@/constants/images";

export default function HeroImage() {
  return (
    <View className="w-full items-center">
      <Text className="absolute left-3 top-24 text-white font-semibold">
        250+
      </Text>

      <Text className="absolute left-3 top-32 text-white/70 text-xs">
        Exercises
      </Text>

      <Text className="absolute right-4 top-16 text-white font-semibold">
        Personalized
      </Text>

      <Text className="absolute right-4 top-24 text-white font-semibold">
        Plans
      </Text>

      <Image
        source={IMAGES.athlete}
        resizeMode="contain"
        className="w-[500px] h-[550px]"
      />
    </View>
  );
}