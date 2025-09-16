import { Stack } from "expo-router";
import React from "react";

export default function InsightsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[category]"
        options={{ headerShown: true, headerTitle: "Insight" }}
      />
    </Stack>
  );
}
