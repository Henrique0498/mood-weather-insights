import { View } from "react-native";
import { Text } from "../ui/text";
import { Avatar, AvatarImage } from "../ui/avatar";

export default function Header() {
  return (
    <View className="p-4 gap-2 bg-white">
      <Text className="text-xl text-center">ThinkLy</Text>

      <View className="flex-row items-center gap-4">
        <Avatar size="md">
          <AvatarImage
            source={{ uri: "https://example.com/user-avatar.png" }}
          />
        </Avatar>
        <View>
          <Text>Olá</Text>
          <Text className="font-semibold">Bem-vindo ao ThinkLy</Text>
        </View>
      </View>
    </View>
  );
}
