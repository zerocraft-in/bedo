// app/(tabs)/settings.tsx

import React from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { ChevronLeftIcon } from "@/assets/icons";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/context/ThemeContext";

type SettingsRowProps = {
  title: string;
  onPress?: () => void;
  showChevron?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
};

function SettingsRow({
  title,
  onPress,
  showChevron = true,
  switchValue,
  onSwitchChange,
}: SettingsRowProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={switchValue !== undefined}
      className="flex-row items-center py-4"
    >
      <Text className="flex-1 text-base font-medium text-foreground">
        {title}
      </Text>

      {switchValue !== undefined ? (
        <Switch value={switchValue} onValueChange={onSwitchChange} />
      ) : (
        showChevron && (
          <ChevronLeftIcon className="w-5 h-5 rotate-180 text-secondary" />
        )
      )}
    </TouchableOpacity>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-foreground mb-3">
        {title}
      </Text>

      <View className="bg-card border border-accent rounded-3xl px-4">
        {children}
      </View>
    </View>
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
          onPress: () => console.log("Delete Account"),
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-center px-5 py-4 relative">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-5 w-10 h-10 rounded-full bg-card border border-accent items-center justify-center"
          >
            <ChevronLeftIcon className="w-5 h-5 text-foreground" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-foreground">
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
          {/* General */}
          <SettingsSection title="General">
            <SettingsRow
              title="Language"
              onPress={() => router.push("/language")}
            />

            <SettingsRow
              title="Notifications"
              onPress={() => router.push("/notification")}
            />
          </SettingsSection>

          {/* Appearance */}
          <SettingsSection title="Appearance">
            <SettingsRow
              title="Dark Mode"
              switchValue={mode === "dark"}
              onSwitchChange={(enabled) =>
                setMode(enabled ? "dark" : "light")
              }
            />
          </SettingsSection>

          {/* Fitness */}
          <SettingsSection title="Fitness">
            <SettingsRow
              title="Workout Preferences"
              onPress={() => router.push("/onboarding")}
            />

            <SettingsRow
              title="Challenge History"
            />

            <SettingsRow
              title="Connected Devices"
            />
          </SettingsSection>

          {/* Support */}
          <SettingsSection title="Support">
            <SettingsRow
              title="Terms of Service"
              onPress={() => router.push("/settings/terms")}
            />

            <SettingsRow
              title="Privacy Policy"
              onPress={() => router.push("/settings/privacy")}
            />
          </SettingsSection>

          {/* Account */}
          <SettingsSection title="Account">
            <SettingsRow
              title="Delete Account"
              onPress={handleDeleteAccount}
            />
          </SettingsSection>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 rounded-3xl py-4 mt-2"
          >
            <Text className="text-center text-white text-base font-semibold">
              Logout
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}