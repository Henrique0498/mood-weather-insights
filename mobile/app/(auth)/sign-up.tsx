import { useRouter } from "expo-router";
import { View } from "react-native";
import { Logo } from "@/components/Logo";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link, LinkText } from "@/components/ui/link";

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <View className="items-center gap-[72px] px-6 py-8">
      <Logo />

      <View className="w-full gap-8">
        <Text className="text-4xl font-bold flex text-center">
          Crie sua conta
        </Text>

        <View className="gap-6">
          <View className="gap-4">
            <Input
              variant="underlined"
              size="lg"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField placeholder="Email" />
            </Input>

            <Input
              variant="underlined"
              size="lg"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField placeholder="Senha" />
            </Input>

            <Input
              variant="underlined"
              size="lg"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField placeholder="Confirmar senha" />
            </Input>
          </View>

          <View className="gap-2">
            <Button
              variant="solid"
              size="md"
              action="primary"
              onPress={() => router.replace("/(tabs)")}
            >
              <ButtonText>Login</ButtonText>
            </Button>

            <View className="flex-row gap-1">
              <Text>Já possui conta? </Text>
              <Link href="/(auth)/login">
                <LinkText>Fazer login → </LinkText>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
