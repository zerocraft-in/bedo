import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { STORY_DATA, StoryUser } from "./StoryViewer";

// ─────────────────────────────────────────────────────────────
// Story Ring
// ─────────────────────────────────────────────────────────────
function StoryRing({
  seen,
  children,
}: {
  seen: boolean;
  children: React.ReactNode;
}) {
  if (seen) {
    return (
      <View
        className="rounded-full"
        style={{
          padding: 3,
          backgroundColor: "#3A3A3C",
        }}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      className="rounded-full"
      style={{
        padding: 3,
        backgroundColor: "#E1306C",
        shadowColor: "#E1306C",
        shadowOpacity: 0.6,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
        elevation: 4,
      }}
    >
      <View
        className="rounded-full"
        style={{
          padding: 2,
          backgroundColor: "#F77737",
        }}
      >
        <View
          className="rounded-full"
          style={{
            padding: 1,
            backgroundColor: "#000",
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Create Story Button
// ─────────────────────────────────────────────────────────────
function CreateStoryButton() {
  return (
    <TouchableOpacity
      activeOpacity={0.95}
      className="items-center mr-4"
      style={{ width: 80 }}
      onPress={() => {}}
    >
      <View className="relative">
        <View className="w-20 h-20 rounded-full bg-zinc-800 items-center justify-center">
          <Text className="text-4xl">👤</Text>
        </View>

        <View className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-500 items-center justify-center border-2 border-black">
          <Text className="text-white font-bold text-sm">+</Text>
        </View>
      </View>

      <Text
        numberOfLines={1}
        className="text-white text-xs mt-2 text-center"
        style={{ width: 70 }}
      >
        Your Story
      </Text>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────
// Story Avatar
// ─────────────────────────────────────────────────────────────
function StoryAvatar({
  user,
  seen,
  onPress,
}: {
  user: StoryUser;
  seen: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="items-center mr-4"
      style={{ width: 80 }}
    >
      {({ pressed }) => (
        <>
          <View style={{ opacity: pressed ? 0.7 : 1 }}>
            <StoryRing seen={seen}>
              <View
                className="rounded-full items-center justify-center"
                style={{
                  width: 70,
                  height: 70,
                  backgroundColor: user.avatarBg,
                }}
              >
                <Text style={{ fontSize: 28 }}>
                  {user.avatarEmoji}
                </Text>
              </View>
            </StoryRing>
          </View>

          <Text
            numberOfLines={1}
            className="text-white text-xs mt-2 text-center"
            style={{ width: 70 }}
          >
            {user.username}
          </Text>
        </>
      )}
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────
// Story Strip
// ─────────────────────────────────────────────────────────────
export default function StoryStrip() {
  const [seen, setSeen] = React.useState<Record<string, boolean>>({});

  const handlePress = (userId: string) => {
    setSeen((prev) => ({
      ...prev,
      [userId]: true,
    }));

    router.push({
      pathname: "/story",
      params: { userId },
    });
  };

  const others = STORY_DATA.filter(
    (user) => user.id !== "you"
  );

  return (
    <View className="mb-5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 4,
        }}
      >
        <CreateStoryButton />

        {others.map((user) => (
          <StoryAvatar
            key={user.id}
            user={user}
            seen={Boolean(seen[user.id])}
            onPress={() => handlePress(user.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}