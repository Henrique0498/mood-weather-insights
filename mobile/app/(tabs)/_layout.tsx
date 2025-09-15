import { Tabs } from "expo-router";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Home02Icon,
  Idea01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";

import { HapticTab } from "@/components/haptic-tab";
import { Text } from "@/components/ui/text";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#292929",
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: ({ focused, color }) => (
            <Text bold={focused} style={{ color }}>
              Home
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <HugeiconsIcon icon={Home02Icon} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarLabel: ({ focused, color }) => (
            <Text bold={focused} style={{ color }}>
              Insights
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon icon={Idea01Icon} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Conta",
          tabBarLabel: ({ focused, color }) => (
            <Text bold={focused} style={{ color }}>
              Conta
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon icon={Settings01Icon} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
