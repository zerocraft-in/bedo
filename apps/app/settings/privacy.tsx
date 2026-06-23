import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { ChevronLeftIcon } from "@/assets/icons";

export default function PrivacyScreen() {
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
            Privacy Policy
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
            Privacy Policy
          </Text>

          <Text className="text-secondary mb-6">
            Last updated: June 2026
          </Text>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-primary mb-2">
              1. Information We Collect
            </Text>

            <Text className="text-foreground leading-6">
              We may collect profile information, workout activity, challenge
              progress, and device information to improve your experience.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-primary mb-2">
              2. How We Use Information
            </Text>

            <Text className="text-foreground leading-6">
              Your information is used to provide app functionality, personalize
              content, track progress, and improve services.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-primary mb-2">
              3. Data Security
            </Text>

            <Text className="text-foreground leading-6">
              We implement reasonable security measures to protect your data
              from unauthorized access and disclosure.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-primary mb-2">
              4. Third-Party Services
            </Text>

            <Text className="text-foreground leading-6">
              Some features may integrate with third-party fitness devices and
              health platforms. Their privacy policies apply separately.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-primary mb-2">
              5. Your Rights
            </Text>

            <Text className="text-foreground leading-6">
              You may request access, correction, or deletion of your personal
              information where applicable by law.
            </Text>
          </View>

          <View>
            <Text className="text-lg font-semibold text-primary mb-2">
              6. Policy Updates
            </Text>

            <Text className="text-foreground leading-6">
              This Privacy Policy may be updated from time to time. Changes will
              be reflected within the application.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}