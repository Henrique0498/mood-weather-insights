import { Link } from "expo-router";
import { View, Text, Button } from "react-native";
import { Logo } from "@/components/Logo";

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4">
      <Logo />
      <Text className="text-2xl text-emerald-300">Login</Text>
      <Link href="/sign-up" asChild>
        <Button title="Go to Sign Up" onPress={() => {}} />
      </Link>
      <Link href="/(tabs)" replace asChild>
        <Button title="Enter app (Home)" onPress={() => {}} />
      </Link>
    </View>
  );
}
