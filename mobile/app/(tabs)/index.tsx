import { View, Text, Button, StatusBar } from "react-native";
import { Link } from "expo-router";
import Header from "@/components/Header";

export default function HomeScreen() {
  return (
    <View>
      <Header />

      <Text className="text-2xl">Home - Hello World</Text>

      <Link href="/insights" asChild>
        <Button title="Ir para Insights" onPress={() => {}} />
      </Link>
      <Link href="/account" asChild>
        <Button title="Ir para Conta" onPress={() => {}} />
      </Link>
    </View>
  );
}
