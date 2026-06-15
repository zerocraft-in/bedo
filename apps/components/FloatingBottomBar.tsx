import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, Animated, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BellIcon, ChatIcon, GridIcon, HomeIcon, IconBell, ProfileIcon } from "@/assets/icons";
export const TAB_BAR_HEIGHT = 72;
export const TAB_BAR_MARGIN = 16;






// ── Tab config ───────────────────────────────────────────────────────────────

type TabConfig = {
  name: string;
  label: string;
  Icon: React.FC<{  className: string}>;
};

const TABS: TabConfig[] = [
  { name: "index", label: "Home", Icon: HomeIcon },
  { name: "workouts", label: "Tasks", Icon: GridIcon },
  { name: "onboarding", label: "Coach", Icon: IconBell },
  { name: "progress", label: "Feed", Icon: ChatIcon },
  { name: "profile", label: "Profile", Icon: ProfileIcon },
];

// ── TabItem ──────────────────────────────────────────────────────────────────

function TabItem({
  tab,
  isFocused,
  onPress,
}: {
  tab: TabConfig;
  isFocused: boolean;
  onPress: () => void;
}) {
  const pillOpacity = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const iconOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(pillOpacity, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.parallel([
        Animated.timing(iconOpacity, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [isFocused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-1 items-center justify-center h-[72px]"
    >
      <Animated.View
        className="absolute w-14 h-14 rounded-[20px] border border-accent"
        style={{
          opacity: pillOpacity,
        }}
      />
      <Animated.View>
        <tab.Icon  className="w-6 h-6 text-secondary" />
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── FloatingTabBar ───────────────────────────────────────────────────────────

export default function FloatingTabBar({
  state,
  navigation,
  descriptors,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const bottomOffset = Math.max(insets.bottom, TAB_BAR_MARGIN);

  // Hide on screens that set tabBarStyle: { display: 'none' }
  const activeRoute = state.routes[state.index];
  const activeOptions = descriptors[activeRoute.key].options as any;
  if (activeOptions?.tabBarStyle?.display === "none") {
    return null;
  }

  return (
    <View
      className="absolute bottom-10 bg-primary-foreground/90 backdrop-blur-md left-5 right-5 h-[72px] flex-row items-center justify-evenly rounded-[26px] border px-2 border-accent overflow-hidden"
      pointerEvents="box-none"
    >
      {TABS.map((tab) => {
        const route = state.routes.find((r) => r.name === tab.name);
        const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
        const isFocused = state.index === routeIndex;

        const onPress = () => {
          if (!route) return;
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabItem
            key={tab.name}
            tab={tab}
            isFocused={isFocused}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}
