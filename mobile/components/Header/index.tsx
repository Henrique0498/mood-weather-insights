import { Platform, View } from "react-native";
import { Text } from "../ui/text";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/stores/auth";

export default function Header() {
  const { user } = useAuthStore((s) => s);

  return (
    <View
      className="p-4 gap-2 bg-white shadow-md"
      style={Platform.OS === "android" ? { elevation: 10 } : undefined}
    >
      <Text className="text-xl text-center">ThinkLy</Text>

      <View className="flex-row items-center gap-4">
        <Avatar size="md">
          <AvatarImage
            source={{ uri: "https://example.com/user-avatar.png" }}
          />
        </Avatar>
        <View>
          <Text>Olá</Text>
          <Text className="font-semibold">{user?.name}</Text>
        </View>
      </View>
    </View>
  );
}
