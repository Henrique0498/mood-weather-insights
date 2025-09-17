import { View } from "react-native";
import { Text } from "../ui/text";
import { Divider } from "../ui/divider";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Loading02Icon, SentIcon } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInsights } from "@/lib/insights-api";
import * as Location from "expo-location";
import { useAuthStore } from "@/stores/auth";
import Toast from "react-native-toast-message";
import { Controller, useForm } from "react-hook-form";

export default function Chat({ isEmpty }: { isEmpty?: boolean }) {
  const { user } = useAuthStore((s) => s);
  const queryClient = useQueryClient();

  const { control, handleSubmit, setValue } = useForm<{ topic: string }>({
    defaultValues: {
      topic: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ topic }: { topic: string }) => {
      if (!topic) {
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permissão de localização negada");
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      return createInsights({
        lat: latitude,
        lon: longitude,
        topic,
        userId: user?.id!,
      });
    },

    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Falha ao criar insight",
        text2: error.message,
        visibilityTime: 4000,
        autoHide: true,
      });
    },
    onSuccess: () => {
      setValue("topic", "");

      queryClient.invalidateQueries({
        queryKey: ["insights"],
      });
      queryClient.invalidateQueries({ queryKey: ["insights-topics"] });
    },
  });

  const icon = isPending ? Loading02Icon : SentIcon;

  const onSubmit = (data: { topic: string }) => mutate(data);

  return (
    <View
      className="p-4 gap-3 bg-white shadow-md w-full rounded-2xl"
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
      {isEmpty && (
        <>
          <Text className="text-xl text-center">Chat</Text>

          <Divider />

          <Text className="text-center">
            Crie seu primeiro insight de forma rápida!
          </Text>
        </>
      )}

      <Controller
        control={control}
        name="topic"
        render={({ field: { onChange, value } }) => (
          <Input variant="rounded" size="xl" className="bg-gray-100">
            <InputField
              placeholder="Escreva um tema"
              value={value}
              onChangeText={onChange}
            />

            <InputSlot className="pe-1">
              <InputIcon
                as={() => (
                  <Button
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
                    disabled={isPending}
                    size="md"
                    variant="solid"
                    className="bg-white flex justify-center items-center w-[35px] h-[35px] p-2 rounded-full"
                    onPress={handleSubmit(onSubmit)}
                  >
                    <HugeiconsIcon icon={icon} size={18} />
                  </Button>
                )}
              />
            </InputSlot>
          </Input>
        )}
      />
    </View>
  );
}
