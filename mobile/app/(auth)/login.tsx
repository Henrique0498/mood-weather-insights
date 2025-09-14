import { Link } from "expo-router";
import { View, Text, Button } from "react-native";

export default function LoginScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 24 }}>Login - Hello World</Text>
      <Link href="/sign-up" asChild>
        <Button title="Go to Sign Up" onPress={() => {}} />
      </Link>
      <Link href="/(tabs)" replace asChild>
        <Button title="Enter app (Home)" onPress={() => {}} />
      </Link>
    </View>
  );
}
