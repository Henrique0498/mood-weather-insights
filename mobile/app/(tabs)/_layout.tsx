import { Tabs, Redirect } from "expo-router";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Idea01Icon,
  Settings01Icon,
  Home02FreeIcons,
} from "@hugeicons/core-free-icons";
import { HapticTab } from "@/components/haptic-tab";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/stores/auth";

export default function TabLayout() {
  const { user } = useAuthStore((s) => s);

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#292929",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 100,
          paddingBottom: 24,
          paddingTop: 5,
          borderTopColor: "#fff",
          boxShadow: "none",
          elevation: 0,
        },
        tabBarItemStyle: {
          flex: 1,
          padding: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: ({ focused, color }) => (
            <Text bold={focused} style={{ color }}>
              Inicio
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon icon={Home02FreeIcons} color={color} size={size} />
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
        name="settings"
        options={{
          title: "Configuração",
          tabBarLabel: ({ focused, color }) => (
            <Text bold={focused} style={{ color }}>
              Configuração
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
