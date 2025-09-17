import { useAuthStore } from "@/stores/auth";
import { Stack, Redirect } from "expo-router";

export default function AuthLayout() {
  const user = useAuthStore((s) => s.user);

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
