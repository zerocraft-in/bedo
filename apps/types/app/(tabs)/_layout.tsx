import { Tabs } from "expo-router";

import {
  HomeIcon,
  GridIcon,
  IconBell,
  ChatIcon,
  ProfileIcon,
} from "@/assets/icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: false,

        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#171717",

          backgroundColor: "#090909",
        },

        tabBarActiveTintColor: "#ffff",
        tabBarInactiveTintColor: "#737373",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon
              className="w-7 h-7"
              color={focused ? "#ffffff" : "#737373"}
              strokeWidth={"2"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="workouts"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <GridIcon
              className={`w-7 h-7`}
              color={focused ? "#ffffff" : "#737373"}
              fill={focused ? "#ffffff" : "none"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="challenges"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconBell
              className={`w-7 h-7`}
              color={focused ? "#ffffff" : "#737373"}
              strokeWidth={"2"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="story"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <ChatIcon
              className={`w-7 h-7`}
              color={focused ? "#ffffff" : "#737373"}
              strokeWidth={"2"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <ProfileIcon
              className={`w-7 h-7`}
              color={focused ? "#ffffff" : "#737373"}
              strokeWidth={"2"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="notification"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
