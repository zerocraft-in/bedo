import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { ChevronLeftIcon } from "@/assets/icons";

export default function TermsScreen() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-accent">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <ChevronLeftIcon className="w-6 h-6 text-foreground" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-foreground ml-2">
            Terms of Service
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 100,
          }}
        >
          <Text className="text-foreground text-2xl font-bold mb-4">
            Terms of Service
          </Text>

          <Text className="text-secondary mb-6">
            Last updated: June 2026
          </Text>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-primary mb-2">
              1. Acceptance of Terms
            </Text>

            <Text className="text-foreground leading-6">
              By accessing and using this fitness application, you agree to
              comply with and be bound by these Terms of Service.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-primary mb-2">
              2. User Responsibilities
            </Text>

            <Text className="text-foreground leading-6">
              You are responsible for maintaining the security of your account
              and ensuring that all information provided is accurate.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-primary mb-2">
              3. Health Disclaimer
            </Text>

            <Text className="text-foreground leading-6">
              Fitness challenges and workouts are provided for informational
              purposes only. Consult a healthcare professional before starting
              any exercise program.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-primary mb-2">
              4. Prohibited Activities
            </Text>

            <Text className="text-foreground leading-6">
              Users must not misuse the platform, manipulate challenge results,
              attempt unauthorized access, or engage in harmful activities.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-primary mb-2">
              5. Termination
            </Text>

            <Text className="text-foreground leading-6">
              We reserve the right to suspend or terminate accounts that violate
              these terms without prior notice.
            </Text>
          </View>

          <View>
            <Text className="text-lg font-semibold text-primary mb-2">
              6. Changes to Terms
            </Text>

            <Text className="text-foreground leading-6">
              These terms may be updated periodically. Continued use of the app
              constitutes acceptance of the revised terms.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}