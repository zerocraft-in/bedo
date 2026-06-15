// components/onboarding/BackgroundGrid.tsx

import { View } from "react-native";

export default function BackgroundGrid() {
  return (
    <View className="absolute inset-0">
      {/* Horizontal */}

      {[...Array(8)].map((_, i) => (
        <View
          key={`h-${i}`}
          className="absolute w-full border-white/10"
          style={{
            top: `${(i + 1) * 12}%`,
            borderTopWidth: 0.5,
          }}
        />
      ))}

      {/* Vertical */}

      {[...Array(4)].map((_, i) => (
        <View
          key={`v-${i}`}
          className="absolute h-full border-white/10"
          style={{
            left: `${(i + 1) * 25}%`,
            borderLeftWidth: 0.5,
          }}
        />
      ))}
    </View>
  );
}