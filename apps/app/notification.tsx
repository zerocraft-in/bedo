import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { BellIcon, ChevronLeftIcon } from "@/assets/icons";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
};

const notifications: NotificationItem[] = [
  {
    id: "1",
    title: "New Story Available",
    message: "Check out today's motivational story.",
    time: "5 min ago",
  },
  {
    id: "2",
    title: "Workout Reminder",
    message: "Your morning workout is waiting.",
    time: "1 hour ago",
  },
  {
    id: "3",
    title: "Achievement Unlocked",
    message: "You've completed a 7-day streak!",
    time: "Yesterday",
  },
];

function NotificationCard({ item }: { item: NotificationItem }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="bg-card border border-border rounded-2xl p-4 mb-4"
    >
      <View className="flex-row">
        <View className="w-10 h-10 rounded-full bg-secondary/10 items-center justify-center mr-3">
          <BellIcon width={20} height={20} className="text-foreground" />
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text
              className="text-foreground font-semibold text-base flex-1 mr-2"
              numberOfLines={1}
            >
              {item.title}
            </Text>

            <Text className="text-muted-foreground text-xs">{item.time}</Text>
          </View>

          <Text className="text-muted-foreground mt-1">{item.message}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationScreen() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1 }}>
        {/* Header */}
        <View className="flex-row items-center px-4 py-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 items-center justify-center"
            activeOpacity={0.7}
          >
            <ChevronLeftIcon
              width={24}
              height={24}
              className="text-foreground"
            />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-foreground">
            Notifications
          </Text>
        </View>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 24,
          }}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <BellIcon width={48} height={48} className="text-foreground" />

              <Text className="text-muted-foreground mt-4">
                No notifications yet
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}
