// app/(tabs)/settings.tsx

import React from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { ChevronLeftIcon } from "@/assets/icons";
import { useAuth } from "@/lib/auth";
import { useTheme, ThemeMode } from "@/context/ThemeContext";

type SettingItemProps = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
};

function SettingItem({
  title,
  subtitle,
  onPress,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="bg-card border border-accent rounded-2xl p-4 mb-3"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-foreground font-semibold text-base">
            {title}
          </Text>

          {subtitle && (
            <Text className="text-secondary mt-1">
              {subtitle}
            </Text>
          )}
        </View>

        <ChevronLeftIcon className="w-5 h-5 rotate-180 text-secondary" />
      </View>
    </TouchableOpacity>
  );
}

function ThemeButton({
  label,
  value,
  selected,
  onPress,
}: {
  label: string;
  value: ThemeMode;
  selected: boolean;
  onPress: (value: ThemeMode) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => onPress(value)}
      className={`flex-1 py-3 rounded-xl border ${
        selected
          ? "bg-primary border-primary"
          : "bg-card border-accent"
      }`}
    >
      <Text
        className={`text-center font-semibold ${
          selected
            ? "text-primary-foreground"
            : "text-foreground"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { mode, setMode } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: signOut,
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Delete account");
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center mr-2"
          >
            <ChevronLeftIcon className="w-6 h-6 text-foreground" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-center text-foreground">
            Settings
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 120,
          }}
        >
          {/* Theme */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-primary mb-3">
              Appearance
            </Text>

            <View className="bg-card border border-accent rounded-2xl p-4">
              <Text className="text-foreground font-semibold mb-4">
                Dark Mode
              </Text>

              <View className="flex-row gap-2">
                <ThemeButton
                  label="Light"
                  value="light"
                  selected={mode === "light"}
                  onPress={setMode}
                />

                <ThemeButton
                  label="Dark"
                  value="dark"
                  selected={mode === "dark"}
                  onPress={setMode}
                />

                <ThemeButton
                  label="System"
                  value="system"
                  selected={mode === "system"}
                  onPress={setMode}
                />
              </View>
            </View>
          </View>

          {/* Preferences */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-primary mb-3">
              Preferences
            </Text>

            <SettingItem
              title="Language"
              subtitle="English"
              onPress={() => router.push("/language")}
            />

            <SettingItem
              title="Workout Preferences"
              subtitle="Goals, difficulty & reminders"
              onPress={() => router.push("/onboarding")}
            />

            <SettingItem
              title="Challenge History"
              subtitle="View completed challenges"
              onPress={() => router.push("/challenge-history")}
            />

            <SettingItem
              title="Connected Devices"
              subtitle="Watch, Band & Health Apps"
              onPress={() => router.push("/connected-devices")}
            />
          </View>

          {/* Support */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-primary mb-3">
              Support
            </Text>

            <SettingItem
              title="Terms of Service"
              subtitle="Read our terms"
              onPress={() => router.push("/terms")}
            />

            <SettingItem
              title="Privacy Policy"
              subtitle="How we handle your data"
              onPress={() => router.push("/privacy")}
            />
          </View>

          {/* Danger Zone */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-red-500 mb-3">
              Danger Zone
            </Text>

            <TouchableOpacity
              onPress={handleDeleteAccount}
              className="bg-red-500 rounded-2xl p-4 mb-3"
            >
              <Text className="text-white font-semibold text-center">
                Delete Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="bg-card border border-red-500 rounded-2xl p-4"
            >
              <Text className="text-red-500 font-semibold text-center">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}