import { Link } from "expo-router";
import { View, Text, Button } from "react-native";

export default function AccountScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 24 }}>Conta - Hello World</Text>
      <Link href="/(tabs)" asChild>
        <Button title="Ir para Home" onPress={() => {}} />
      </Link>
      <Link href="/insights" asChild>
        <Button title="Ir para Insights" onPress={() => {}} />
      </Link>

      <Link href="/(auth)/login" asChild>
        <Button title="Ir para Login" onPress={() => {}} />
      </Link>
    </View>
  );
}
