import { Image } from "expo-image";
import { View, Text } from "react-native";

export function Logo() {
  return (
    <View className="flex items-center gap-3 pt-12 pb-20">
      <Image
        source={require("../../assets/images/icon.png")}
        style={{ width: 108, height: 108, borderRadius: 8 }}
      />
      <Text className="text-5xl font-bold text-primary-950">ThinkLy</Text>
    </View>
  );
}
