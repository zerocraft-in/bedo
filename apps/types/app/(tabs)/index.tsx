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
      <SafeAreaView edges={["top", "left", "right"]}  style={{flex:1}} >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 32,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#fafafa"]} // Android
              tintColor="#fafafa" // iOS
              progressBackgroundColor={"#000"}
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
              onPress={() => router.push("/(tabs)/notification")}
              className="w-14 h-14 rounded-full border border-accent items-center justify-center"
            >
              <BellIcon className="w-6 h-6 text-secondary" />
            </TouchableOpacity>
          </View>

          {/* Stories */}
          <StoryStrip />

          {/* Example Feed Section */}
          <View className="px-5 mt-2">
            <Text className="text-primary text-xl font-bold mb-4">
              Today's Workout
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              className="bg-card rounded-3xl p-5 mb-4"
            >
              <Text className="text-primary text-lg font-semibold">
                Full Body Strength
              </Text>

              <Text className="text-secondary mt-2">45 min • Intermediate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              className="bg-card rounded-3xl p-5 mb-4"
            >
              <Text className="text-primary text-lg font-semibold">
                Cardio Burn
              </Text>

              <Text className="text-secondary mt-2">30 min • Beginner</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              className="bg-card rounded-3xl p-5"
            >
              <Text className="text-primary text-lg font-semibold">
                Core Training
              </Text>

              <Text className="text-secondary mt-2">20 min • Advanced</Text>
            </TouchableOpacity>
          </View>


          {/* Daily Activity */}
          <View className="px-5 mt-2">
            <View className="bg-card rounded-3xl p-5">
              <Text className="text-secondary text-sm">Today's Progress</Text>

              <Text className="text-primary text-3xl font-bold mt-2">
                7,842
              </Text>

              <Text className="text-secondary mt-1">
                of 10,000 steps completed
              </Text>

              <View className="h-3 bg-accent rounded-full mt-4 overflow-hidden">
                <View
                  className="h-full rounded-full bg-yellow-600"
                  style={{ width: "78%" }}
                />
              </View>
            </View>
          </View>

          {/* Workout Recommendation */}
          <View className="px-5 mt-5">
            <Text className="text-primary text-xl font-bold mb-4">
              Recommended For You
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              className="bg-card rounded-3xl p-5 mb-4"
            >
              <Text className="text-primary text-lg font-semibold">
                Full Body Strength
              </Text>

              <Text className="text-secondary mt-2">45 min • Intermediate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              className="bg-card rounded-3xl p-5"
            >
              <Text className="text-primary text-lg font-semibold">
                HIIT Fat Burn
              </Text>

              <Text className="text-secondary mt-2">25 min • Advanced</Text>
            </TouchableOpacity>
          </View>

          {/* Invite Friends Challenge */}
          <View className="px-5 mt-5">
            <View className="bg-yellow-600 rounded-3xl p-5">
              <Text className="text-white text-xl font-bold">
                30-Day Challenge
              </Text>

              <Text className="text-white/80 mt-2">
                Invite friends and earn exclusive badges.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-white rounded-2xl px-5 py-3 self-start mt-4"
              >
                <Text className="font-semibold text-black">Invite Friends</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bento Stats */}
          <View className="px-5 mt-5">
            <Text className="text-primary text-xl font-bold mb-4">
              Your Stats
            </Text>

            <View className="flex-row gap-3">
              <View className="flex-1 bg-card rounded-3xl p-4">
                <Text className="text-3xl">🔥</Text>

                <Text className="text-primary text-2xl font-bold mt-2">12</Text>

                <Text className="text-secondary">Day Streak</Text>
              </View>

              <View className="flex-1 bg-card rounded-3xl p-4">
                <Text className="text-3xl">🏆</Text>

                <Text className="text-primary text-2xl font-bold mt-2">28</Text>

                <Text className="text-secondary">Badges</Text>
              </View>
            </View>

            <View className="flex-row gap-3 mt-3">
              <View className="flex-1 bg-card rounded-3xl p-4">
                <Text className="text-3xl">💪</Text>

                <Text className="text-primary text-2xl font-bold mt-2">
                  164
                </Text>

                <Text className="text-secondary">Workouts</Text>
              </View>

              <View className="flex-1 bg-card rounded-3xl p-4">
                <Text className="text-3xl">⚡</Text>

                <Text className="text-primary text-2xl font-bold mt-2">
                  2,460
                </Text>

                <Text className="text-secondary">Calories</Text>
              </View>
            </View>
          </View>

          {/* Nutrition Summary */}
          <View className="px-5 mt-5">
            <View className="bg-card rounded-3xl p-5">
              <Text className="text-primary text-xl font-bold">Nutrition</Text>

              <View className="flex-row justify-between mt-4">
                <View>
                  <Text className="text-secondary">Protein</Text>
                  <Text className="text-primary text-lg font-bold">135g</Text>
                </View>

                <View>
                  <Text className="text-secondary">Carbs</Text>
                  <Text className="text-primary text-lg font-bold">220g</Text>
                </View>

                <View>
                  <Text className="text-secondary">Fat</Text>
                  <Text className="text-primary text-lg font-bold">54g</Text>
                </View>
              </View>
            </View>
          </View>

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
