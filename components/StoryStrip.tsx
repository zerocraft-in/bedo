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

// ── Gradient ring using layered Views ─────────────────────────────────────────
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
        className="rounded-full p-[2.5px]"
        style={{ backgroundColor: "#3A3A3C" }}
      >
        {children}
      </View>
    );
  }
  // Simulate gradient ring with two nested views
  return (
    <View
      className="rounded-full p-[2.5px]"
      style={{
        // approximate Instagram gradient: pink → orange → yellow
        backgroundColor: "#E1306C",
        // layered glow
        shadowColor: "#E1306C",
        shadowOpacity: 0.6,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
        elevation: 4,
      }}
    >
      <View
        className="rounded-full p-[1.5px]"
        style={{ backgroundColor: "#F77737" }}
      >
        <View
          className="rounded-full p-[1px]"
          style={{ backgroundColor: "#000" }}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

// ── Your Story (create button) ────────────────────────────────────────────────
function CreateStoryButton() {
  return (
    <TouchableOpacity
      activeOpacity={0.95}
      className="items-center mr-4"
      style={{ width: 70 }}
      onPress={() => {
        // In a real app, open camera here
      }}
    >
      <View className="relative">
        <View
          className="w-20 h-20 rounded-full items-center bg-muted justify-center"
 
        >
          <Text style={{ fontSize: 28 }}>👤</Text>
        </View>
        {/* Plus badge */}
        <View
          className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full items-center justify-center border-2 border-accent"
      
        >
          <Text className="text-foreground font-bold" style={{ fontSize: 14, lineHeight: 16 }}>+</Text>
        </View>
      </View>
      <Text
        className="text-primary  text-xs mt-1.5 text-center"
        numberOfLines={1}
        style={{ width: 64 }}
      >
        Your Story
      </Text>
    </TouchableOpacity>
  );
}

// ── Single Story Avatar ───────────────────────────────────────────────────────
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
      className="items-center mr-6"
      style={{ width: 70 }}
    >
      {({ pressed }) => (
        <>
          <View style={{ opacity: pressed ? 0.7 : 1 }}>
            <StoryRing seen={seen}>
              <View
                className="w-17.5 h-17.5 rounded-full items-center justify-center"
                style={{ backgroundColor: user.avatarBg }}
              >
                <Text style={{ fontSize: 26 }}>{user.avatarEmoji}</Text>
              </View>
            </StoryRing>
          </View>
          <Text
            className="text-primary text-xs mt-1.5 text-center"
            numberOfLines={1}
            style={{ width: 64 }}
          >
            {user.username}
          </Text>
        </>
      )}
    </Pressable>
  );
}

// ── Story Strip ───────────────────────────────────────────────────────────────
export default function StoryStrip() {
  // Track seen stories per session (in real app use persistent state)
  const [seen, setSeen] = React.useState<Record<string, boolean>>({});

  const handlePress = (userId: string) => {
    setSeen((prev) => ({ ...prev, [userId]: true }));
    router.push({ pathname: "/story", params: { userId } });
  };

  // Skip "you" from the regular list since it has a special create button
  const others = STORY_DATA.filter((u) => u.id !== "you");

  return (
    <View className="mb-5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4 }}
      >
        {/* Create story */}
        <CreateStoryButton />

        {/* Other users */}
        {others.map((user) => (
          <StoryAvatar
            key={user.id}
            user={user}
            seen={!!seen[user.id]}
            onPress={() => handlePress(user.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}