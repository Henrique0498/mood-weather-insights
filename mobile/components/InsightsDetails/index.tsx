import { InsightResponse } from "@/lib/insights-api";
import { Text } from "../ui/text";
import { View } from "react-native";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Delete03Icon } from "@hugeicons/core-free-icons";

interface ListInsightsDetailsProps {
  insights: InsightResponse[];
  topic: string;
}

export function ListInsightsDetails({
  insights,
  topic,
}: ListInsightsDetailsProps) {
  return (
    <View className="gap-4">
      <View className="flex flex-row justify-between items-center">
        <Text className="text-xl text-typography-900 font-semibold capitalize">
          {topic}
        </Text>

        <Button variant="link" size="xs" action="negative">
          <HugeiconsIcon
            icon={Delete03Icon}
            size={24}
            className="text-error-400"
          />
        </Button>
      </View>

      <View className="gap-2">
        {insights.map((insight) => (
          <InsightsItem key={insight.id} {...insight} />
        ))}
      </View>
    </View>
  );
}

function InsightsItem({ content }: InsightResponse) {
  return (
    <View
      className="p-4 rounded-lg bg-white"
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
      <Text className="text-primary-400">{content}</Text>
    </View>
  );
}
