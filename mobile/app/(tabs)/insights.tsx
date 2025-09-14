import { Link } from "expo-router";
import { View, Text, Button } from "react-native";

export default function InsightsScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 24 }}>Insights - Hello World</Text>
      <Link href="/(tabs)" asChild>
        <Button title="Ir para Home" onPress={() => {}} />
      </Link>
      <Link href="/account" asChild>
        <Button title="Ir para Conta" onPress={() => {}} />
      </Link>
    </View>
  );
}
