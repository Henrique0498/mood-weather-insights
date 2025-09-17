import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import Header from "@/components/Header";
import Chat from "@/components/Chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyInsights from "@/components/EmptyInsigths";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";
import { TopicsList } from "@/components/Topics";
import { getTopicsInsights } from "@/lib/insights-topic-api";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  const { data: topics = [], isFetching } = useQuery({
    queryKey: ["insights-topics"],
    queryFn: () =>
      getTopicsInsights({
        userId: user?.id ?? "",
      }),
  });

  const isEmpty = !topics.length && !isFetching;
  const CHAT_HEIGHT = isEmpty ? 160 : 80;
  const bottomPadding = CHAT_HEIGHT + insets.bottom + 16;

  return (
    <View className="bg-white flex-1">
      <Header />

      <KeyboardAvoidingView className="gap-6 flex-1">
        <ScrollView
          contentContainerStyle={{
            padding: 24,
            gap: 8,
            paddingBottom: bottomPadding, // espaço para o Chat sobreposto
          }}
          showsVerticalScrollIndicator={false}
        >
          {(isEmpty && <EmptyInsights />) || <TopicsList topics={topics} />}
        </ScrollView>

        <View
          className=""
          pointerEvents="box-none"
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            bottom: insets.bottom + 8,
          }}
        >
          <Chat isEmpty={isEmpty} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
