
// lib/WheelPicker.tsx
// Custom wheel picker — no third-party picker lib needed.
// Uses ScrollView with snapToInterval + momentum for the drum-roll feel.
// Fades top/bottom rows with LinearGradient (expo-linear-gradient).

import React, { useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface WheelPickerProps {
  data: string[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  itemHeight?: number;
  visibleItems?: number;         // must be odd: 3 or 5
  activeColor?: string;
  inactiveColor?: string;
  fontSize?: number;
  style?: ViewStyle;
}

export default function WheelPicker({
  data,
  selectedIndex,
  onIndexChange,
  itemHeight = 58,
  visibleItems = 5,
  activeColor = "#ffffff",
  inactiveColor = "rgba(255,255,255,0.18)",
  fontSize = 24,
  style,
}: WheelPickerProps) {
  const wrapperHeight = itemHeight * visibleItems;
  const paddingItems = Math.floor(visibleItems / 2); // items above/below center

  const scrollRef = useRef<ScrollView>(null);
  const isDragging = useRef(false);

  // Scroll to index imperatively
  const scrollToIndex = useCallback(
    (index: number, animated = true) => {
      scrollRef.current?.scrollTo({
        y: index * itemHeight,
        animated,
      });
    },
    [itemHeight]
  );

  // Called when scroll settles
  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const rawIndex = e.nativeEvent.contentOffset.y / itemHeight;
      const clamped = Math.max(0, Math.min(Math.round(rawIndex), data.length - 1));
      onIndexChange(clamped);
      // Snap precisely to grid
      scrollToIndex(clamped);
      isDragging.current = false;
    },
    [itemHeight, data.length, onIndexChange, scrollToIndex]
  );

  // Also handle when user lifts finger without momentum (slow drag)
  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isDragging.current) return; // momentum will fire separately
      const rawIndex = e.nativeEvent.contentOffset.y / itemHeight;
      const clamped = Math.max(0, Math.min(Math.round(rawIndex), data.length - 1));
      onIndexChange(clamped);
      scrollToIndex(clamped);
    },
    [itemHeight, data.length, onIndexChange, scrollToIndex]
  );

  // Text style per row
  function itemStyle(index: number): object {
    const distance = Math.abs(index - selectedIndex);
    if (distance === 0) {
      return {
        color: activeColor,
        fontSize: fontSize + 8,
        fontWeight: "800" as const,
        letterSpacing: -0.5,
      };
    }
    if (distance === 1) {
      return {
        color: "rgba(255,255,255,0.45)",
        fontSize: fontSize + 2,
        fontWeight: "600" as const,
      };
    }
    return {
      color: inactiveColor,
      fontSize: fontSize - 2,
      fontWeight: "400" as const,
    };
  }

  return (
    <View style={[{ height: wrapperHeight, overflow: "hidden" }, style]}>
      {/* Gold selection highlight bar */}
      <View
        pointerEvents="none"
        style={[
          styles.highlight,
          {
            top: paddingItems * itemHeight,
            height: itemHeight,
          },
        ]}
      />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        scrollEventThrottle={16}
        contentOffset={{ x: 0, y: selectedIndex * itemHeight }}
        contentContainerStyle={{
          paddingTop: paddingItems * itemHeight,
          paddingBottom: paddingItems * itemHeight,
        }}
        onScrollBeginDrag={() => { isDragging.current = true; }}
        onMomentumScrollEnd={handleMomentumEnd}
        onScrollEndDrag={handleScrollEnd}
        bounces={false}
        overScrollMode="never"
      >
        {data.map((item, index) => (
          <View
            key={index}
            style={{ height: itemHeight, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={itemStyle(index)}>{item}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Top fade */}
      <LinearGradient
        colors={["#0a0a0a", "rgba(10,10,10,0.85)", "transparent"]}
        style={[styles.fade, { top: 0 }]}
        pointerEvents="none"
      />
      {/* Bottom fade */}
      <LinearGradient
        colors={["transparent", "rgba(10,10,10,0.85)", "#0a0a0a"]}
        style={[styles.fade, { bottom: 0 }]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  highlight: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "rgba(202,138,4,0.1)",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ca8a04",
    borderRadius: 14,
    zIndex: 1,
  },
  fade: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 90,
    zIndex: 2,
    pointerEvents: "none",
  },
});