import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import Chat from "@/components/Chat";

export default function InsightsCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();

  return (
    <View className="bg-white flex-1 p-6 gap-4 flex justify-between">
      <View>
        <Text className="text-xl font-semibold">Categoria: {category}</Text>
        <Text className="text-typography-500">
          Aqui vão os insights filtrados por categoria.
        </Text>
      </View>

      <Chat />
    </View>
  );
}
