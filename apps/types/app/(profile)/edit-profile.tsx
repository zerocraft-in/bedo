// /(tabs)/notification.tsx
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { BellIcon, ChevronLeftIcon } from "@/assets/icons";

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
          <View className="flex-1 items-center flex-row">
            {" "}
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-14 h-14  mr-4 rounded-3xl bg-accent border border-accent items-center justify-center overflow-hidden"
            >
              <ChevronLeftIcon className="w-6 h-6 text-secondary" />
            </TouchableOpacity>
            <Text className="text-primary text-2xl font-bold">
              Edit profile
            </Text>
          </View>

          {/* <TouchableOpacity
            onPress={() => router.back()}
            className="w-14 h-14 rounded-3xl bg-accent border border-accent items-center justify-center overflow-hidden"
          >
            <ChevronLeftIcon className="w-6 h-6 text-secondary" />
          </TouchableOpacity> */}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20 }}
        >
          {notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              className="bg-card border border-accent rounded-2xl p-4 mb-4"
            >
              <View className="flex-row">
                <View className="w-10 h-10 rounded-full bg-secondary/10 items-center justify-center mr-3">
                  <BellIcon className="w-6 h-6 text-secondary" />
                </View>

                <View className="flex-1">
                  <View className="flex-row justify-between items-start">
                    <Text className="text-primary font-semibold text-base flex-1">
                      {item.title}
                    </Text>

                    <Text className="text-secondary text-xs">{item.time}</Text>
                  </View>

                  <Text className="text-secondary mt-1">{item.message}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
