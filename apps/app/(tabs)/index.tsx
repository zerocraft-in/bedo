// app/(tabs)/index.tsx

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { BellIcon } from "@/assets/icons";
import StoryStrip from "@/components/StoryStrip";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      // Refresh API calls here
      // await fetchStories();
      // await fetchWorkouts();
      // await fetchProfile();

      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.log("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: 32,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#fafafa"]}
              tintColor="#fafafa"
              progressBackgroundColor="#000"
              progressViewOffset={20}
            />
          }
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-2 mb-5">
            <View>
              <Text className="text-secondary text-base">Welcome back 🙌</Text>

              <Text className="text-primary text-3xl font-bold mt-1">
                Jordan Maran
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/notification")}
              className="w-14 h-14 rounded-full border border-accent items-center justify-center"
            >
              <BellIcon className="w-6 h-6 text-secondary" />
            </TouchableOpacity>
          </View>

          {/* Stories */}
          <StoryStrip />
        
          {/* Recent Workout */}
          <View className="px-5 mt-5">
            <View className="bg-card rounded-3xl p-5">
              <Text className="text-primary text-xl font-bold">
                Last Workout
              </Text>

              <Text className="text-primary mt-4 font-semibold">Push Day</Text>

              <Text className="text-secondary mt-1">
                Chest • Shoulders • Triceps
              </Text>

              <Text className="text-secondary mt-2">
                Completed yesterday • 58 min
              </Text>
            </View>
          </View>

          {/* Motivation Footer */}
          <View className="px-5 mt-8 mb-10">
            <Text className="text-center text-secondary text-base">
              BE FIRST. DO NEXT.
            </Text>

            <Text className="text-center text-primary text-3xl font-black mt-2">
              KEEP MOVING 🚀
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
