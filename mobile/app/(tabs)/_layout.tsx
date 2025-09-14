import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import Idea01Icon from "hugeicons-react-native/dist/esm/Idea01Icon";
import Settings01Icon from "hugeicons-react-native/dist/esm/Settings01Icon";
import Home02Icon from "hugeicons-react-native/dist/esm/Home02Icon";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home02Icon key="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarIcon: ({ color, size }) => (
            <Idea01Icon key="insights" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Conta",
          tabBarIcon: ({ color, size }) => (
            <Settings01Icon key="settings" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
