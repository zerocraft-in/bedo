// /(tabs)/profile.tsx

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import {
  BellIcon,
  ChevronLeftIcon,
  ImageIcon,
  MenuIcon,
  SettingsIcon,
} from "@/assets/icons";

const notifications = [
  {
    id: 1,
    title: "New Story Available",
    message: "Check out today's motivational story.",
    time: "5 min ago",
  },
  {
    id: 2,
    title: "Workout Reminder",
    message: "Your morning workout is waiting.",
    time: "1 hour ago",
  },
  {
    id: 3,
    title: "Achievement Unlocked",
    message: "You've completed 7 days streak!",
    time: "Yesterday",
  },
];

export default function NotificationScreen() {
  return (
    <View className="flex-1 bg-background ">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-5 py-4 ">
          <View className="flex-1 justify-between items-center flex-row">
            {" "}
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-14 h-14  mr-4 rounded-3xl border border-accent items-center justify-center overflow-hidden"
            >
              <ChevronLeftIcon className="w-6 h-6 text-secondary" />
            </TouchableOpacity>
            <Text className="text-primary text-2xl font-bold">Profile</Text>
            <TouchableOpacity
              onPress={() => router.navigate("/settings")}
              className="w-14 h-14  rounded-3xl border border-accent items-center justify-center overflow-hidden"
            >
              <SettingsIcon className="w-6 h-6 text-secondary" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 20 }}
        >
          <View className="flex-1 gap-4 items-center flex-row pb-5 px-5">
            {" "}
            <View className="relative">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-24 h-24 rounded-full border border-accent items-center justify-center overflow-hidden"
              >
                <Text className="text-primary text-2xl font-semibold">M</Text>
              </TouchableOpacity>
              {/* Plus badge */}
              <View className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full items-center justify-center border-2 border-accent">
                <Text
                  className="text-foreground font-bold"
                  style={{ fontSize: 14, lineHeight: 16 }}
                >
                  +
                </Text>
              </View>
            </View>
            <View className="flex-1 gap-4 items-center flex-row">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-24 h-24 items-center justify-center overflow-hidden"
              >
                <Text className="text-primary text-lg font-semibold">20</Text>
                <Text className="text-primary text-base font-medium">
                  Posts
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.back()}
                className="w-24 h-24 items-center justify-center overflow-hidden"
              >
                <Text className="text-primary text-lg font-semibold">1.2K</Text>
                <Text className="text-primary text-base font-medium">
                  Followers
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.back()}
                className="w-24 h-24 items-center justify-center overflow-hidden"
              >
                <Text className="text-primary text-lg font-semibold">1K</Text>
                <Text className="text-primary text-base font-medium">
                  Following
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row w-full gap-2.5 pb-5 px-5">
            <TouchableOpacity
              className="flex-1 py-2.5 items-center justify-center rounded-xl bg-accent"
              onPress={() => router.push("/settings")}
            >
              <Text className="text-primary text-lg font-semibold">
                Edit Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 py-2.5 items-center justify-center rounded-xl bg-accent"
              onPress={() => {}}
            >
              <Text className="text-primary text-lg font-semibold">
                Share Profile
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row w-full gap-2.5 pb-2 px-5 border-b border-accent">
            <TouchableOpacity
              className="flex-1 py-2.5 items-center justify-center rounded-xl"
              onPress={() => router.push("/settings")}
            >
              <ImageIcon className="w-6 h-6 text-secondary" />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-2.5 items-center justify-center rounded-xl"
              onPress={() => router.push("/settings")}
            >
              <ImageIcon className="w-6 h-6 text-secondary" />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-2.5 items-center justify-center rounded-xl"
              onPress={() => router.push("/settings")}
            >
              <ImageIcon className="w-6 h-6 text-secondary" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
