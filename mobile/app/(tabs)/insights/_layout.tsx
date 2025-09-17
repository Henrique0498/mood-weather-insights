import { Stack } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";

export default function InsightsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[category]"
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Insight",
          headerLeft: () => (
            <Pressable
              onPress={() =>
                navigation.canGoBack()
                  ? navigation.goBack()
                  : navigation.replace("/(tabs)/insights")
              }
              style={{ paddingHorizontal: 12, paddingVertical: 6 }}
              hitSlop={8}
            >
              <Text className="text-lg font-semibold">{"<"}</Text>
            </Pressable>
          ),
        })}
      />
    </Stack>
  );
}
