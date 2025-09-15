import "react-native-css-interop";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
// Reanimated side-effect import removed as it's unused
import { LogBox } from "react-native";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "../assets/styles/global.css";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/assets/styles/global.css';

export const unstable_settings = {
  anchor: "(tabs)",
};

// Silence SafeAreaView deprecation warning from dependencies in development
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated",
  "Please use 'react-native-safe-area-context' instead",
]);

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    
    <GluestackUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GluestackUIProvider config={config}>
          <ThemeProvider value={DefaultTheme}>
            <Stack initialRouteName="(auth)">
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
    </GluestackUIProvider>
  
  );
}
