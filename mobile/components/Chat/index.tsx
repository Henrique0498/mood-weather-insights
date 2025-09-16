import { View } from "react-native";
import { Text } from "../ui/text";
import { Divider } from "../ui/divider";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SentIcon } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";

export default function Chat({ isEmpty }: { isEmpty?: boolean }) {
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

      <Input variant="rounded" size="xl" className="bg-gray-100">
        <InputField placeholder="Escreva um tema" />

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
                size="md"
                variant="solid"
                className="bg-white flex justify-center items-center w-[35px] h-[35px] p-2 rounded-full"
              >
                <HugeiconsIcon icon={SentIcon} size={18} />
              </Button>
            )}
          />
        </InputSlot>
      </Input>
    </View>
  );
}
