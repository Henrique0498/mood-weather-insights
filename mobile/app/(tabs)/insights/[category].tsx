import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyInsights from "@/components/EmptyInsigths";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { getInsights } from "@/lib/insights-api";
import { ListInsightsDetails } from "@/components/InsightsDetails";
import { Button, ButtonText } from "@/components/ui/button";

export default function InsightsCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  const { data: insights = [], isFetching } = useQuery({
    queryKey: [`insights-details-${category}`],
    queryFn: () =>
      getInsights({
        userId: user?.id ?? "",
        topic: category,
      }),
    enabled: Boolean(user?.id),
    staleTime: 1000 * 30,
  });

  const isEmpty = !insights.length && !isFetching;
  const bottomPadding = 40 + insets.bottom + 16;

  return (
    <View className="bg-white flex-1">
      <KeyboardAvoidingView className="gap-6 flex-1">
        <ScrollView
          contentContainerStyle={{
            padding: 24,
            gap: 8,
            paddingBottom: bottomPadding,
          }}
          showsVerticalScrollIndicator={false}
        >
          {(isEmpty && <EmptyInsights />) || (
            <ListInsightsDetails insights={insights} topic={category} />
          )}
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
          <Button>
            <ButtonText>Criar novo tópico</ButtonText>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
