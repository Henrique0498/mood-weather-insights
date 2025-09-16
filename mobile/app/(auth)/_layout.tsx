import { useAuthStore } from "@/stores/auth";
import { Stack, useRouter } from "expo-router";

export default function AuthLayout() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  if (user) {
    router.replace("/(tabs)");
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
