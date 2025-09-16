import { View } from "react-native";
import EmptyIllustration from "@/assets/images/empty.svg";
import { Text } from "../ui/text";

export default function EmptyInsights() {
  return (
    <View className="items-center">
      <View className="max-w-64">
        <EmptyIllustration width={208} height={208} />
        <Text className="text-xl font-semibold text-center">
          Nenhum insight foi criado até o momento.
        </Text>
      </View>
    </View>
  );
}
