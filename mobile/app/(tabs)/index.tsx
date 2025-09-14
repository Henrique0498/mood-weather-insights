import { View, Text, Button } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Text style={{ fontSize: 24 }}>Home - Hello World</Text>
      <Link href="/(auth)/login" asChild>
        <Button title="Ir para Login" onPress={() => {}} />
      </Link>
      <Link href="/insights" asChild>
        <Button title="Ir para Insights" onPress={() => {}} />
      </Link>
      <Link href="/account" asChild>
        <Button title="Ir para Conta" onPress={() => {}} />
      </Link>
    </View>
  );
}
