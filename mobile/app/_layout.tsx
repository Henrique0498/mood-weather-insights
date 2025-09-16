import "react-native-css-interop";

import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import Toast from "react-native-toast-message";

import "../assets/styles/global.css";
import { KeyboardAvoidingView } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <GluestackUIProvider>
      <QueryClientProvider client={queryClient}>
        <KeyboardAvoidingView enabled className="flex-1" behavior="padding">
          <SafeAreaProvider>
            <ThemeProvider value={DefaultTheme}>
              <Stack initialRouteName="(auth)">
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <Toast />
            </ThemeProvider>
          </SafeAreaProvider>
        </KeyboardAvoidingView>
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
