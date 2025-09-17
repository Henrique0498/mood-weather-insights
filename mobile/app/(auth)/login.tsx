import { useRouter } from "expo-router";
import { View } from "react-native";
import { Logo } from "@/components/Logo";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link, LinkText } from "@/components/ui/link";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "@/lib/auth-api";
import { useAuthStore } from "@/stores/auth";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginFormData, loginSchema } from "@/lib/validation/login-schema";
import { Toast } from "toastify-react-native";

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginFormData) => loginRequest(data),
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
        text1: "Falha ao fazer login",
        text2: error.message,
        visibilityTime: 4000,
        autoHide: true,
      });
    },
  });

  const onSubmit = (data: LoginFormData) => mutate(data);

  return (
    <View className="items-center gap-[72px] bg-white px-6 py-8 flex-1">
      <Logo />

      <View className="w-full gap-8">
        <Text className="text-4xl font-bold flex text-center text-primary-950">
          Login
        </Text>

        <View className="gap-6">
          <View className="gap-4">
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
              <Text>Não possui uma conta? </Text>
              <Link href="/(auth)/sign-up">
                <LinkText>Criar conta → </LinkText>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
