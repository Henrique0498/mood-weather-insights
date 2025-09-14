import { Link } from "expo-router";
import { View, Text, Button } from "react-native";

export default function SignUpScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 24 }}>Cadastro - Hello World</Text>
      <Link href="/login" asChild>
        <Button title="Voltar para Login" onPress={() => {}} />
      </Link>
      <Link href="/(tabs)" replace asChild>
        <Button title="Entrar no App (Home)" onPress={() => {}} />
      </Link>
    </View>
  );
}
