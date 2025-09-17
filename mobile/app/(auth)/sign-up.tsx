import { useRouter } from "expo-router";
import { View } from "react-native";
import { Logo } from "@/components/Logo";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link, LinkText } from "@/components/ui/link";
import { useAuthStore } from "@/stores/auth";
import {
  RegisterFormData,
  registerSchema,
} from "@/lib/validation/register-schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerRequest } from "@/lib/auth-api";
import { Toast } from "toastify-react-native";

export default function SignUpScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterFormData) => registerRequest(data),
    onSuccess: ({ data }) => {
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      router.replace("/(tabs)");
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Falha ao fazer registro",
        text2: error.message,
        visibilityTime: 4000,
        autoHide: true,
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => mutate(data);

  return (
    <View className="items-center gap-[72px] px-6 py-8">
      <Logo />

      <View className="w-full gap-8">
        <Text className="text-4xl font-bold flex text-center text-primary-950">
          Crie sua conta
        </Text>

        <View className="gap-6">
          <View className="gap-4">
            <View>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <Input
                    variant="underlined"
                    size="lg"
                    isInvalid={!!errors.name}
                  >
                    <InputField
                      placeholder="Nome"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                    />
                  </Input>
                )}
              />
              {errors.name && (
                <Text className="text-red-500">{errors.name.message}</Text>
              )}
            </View>

            <View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    variant="underlined"
                    size="lg"
                    isInvalid={!!errors.email}
                  >
                    <InputField
                      placeholder="Email"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                    />
                  </Input>
                )}
              />
              {errors.email && (
                <Text className="text-red-500">{errors.email.message}</Text>
              )}
            </View>

            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    variant="underlined"
                    size="lg"
                    isInvalid={!!errors.password}
                  >
                    <InputField
                      placeholder="Senha"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry
                    />
                  </Input>
                )}
              />
              {errors.password && (
                <Text className="text-red-500">{errors.password.message}</Text>
              )}
            </View>

            <View>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <Input
                    variant="underlined"
                    size="lg"
                    isInvalid={!!errors.confirmPassword}
                  >
                    <InputField
                      placeholder="Confirmar senha"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry
                    />
                  </Input>
                )}
              />
              {errors.confirmPassword && (
                <Text className="text-red-500">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>
          </View>

          <View className="gap-2">
            <Button
              variant="solid"
              size="md"
              action="primary"
              isDisabled={isPending}
              onPress={handleSubmit(onSubmit)}
            >
              <ButtonText>{isPending ? "Entrando..." : "Login"}</ButtonText>
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
