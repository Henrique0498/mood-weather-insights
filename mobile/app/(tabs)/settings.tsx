import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  Delete02Icon,
  Edit02Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { View } from "react-native";

export default function AccountScreen() {
  return (
    <View className="bg-white flex-1 px-6 pb-4 pt-11 gap-4">
      <View className="py-1.5">
        <Text className="text-2xl font-semibold">Configuração</Text>
      </View>

      <View className="gap-6">
        <View className="items-center gap-4">
          <Avatar size="2xl">
            <AvatarImage
              source={{ uri: "https://example.com/user-avatar.png" }}
            />
          </Avatar>

          <Text className="text-lg font-semibold">Nome do Usuário</Text>
        </View>

        <View className="gap-3">
          <SettingItem title="Nome" value="Nome do Usuário" />
          <SettingItem title="Email" value="usuario@example.com" />
          <SettingItem title="Senha" value="**********" />
        </View>

        <View className="gap-2">
          <Button
            action="negative"
            variant="link"
            className="justify-start px-6"
          >
            <ButtonIcon
              as={() => (
                <HugeiconsIcon icon={Delete02Icon} size={24} color="#E63535" />
              )}
            />
            <ButtonText>Excluir conta</ButtonText>
          </Button>
          <Button action="secondary" className="justify-start px-6">
            <ButtonIcon
              as={() => <HugeiconsIcon icon={Logout01Icon} size={24} />}
            />
            <ButtonText>Sair</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
}

function SettingItem({ title, value }: { title: string; value: string }) {
  return (
    <View
      className="p-4 bg-white rounded-lg flex-row justify-between items-center"
      style={{
        shadowColor: "#262626",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 19,
      }}
    >
      <View>
        <Text className="text-lg font-semibold">{title}</Text>
        <Text className="text-typography-500">{value}</Text>
      </View>

      <HugeiconsIcon icon={Edit02Icon} size={24} />
    </View>
  );
}
