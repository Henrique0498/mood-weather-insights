import { View } from "react-native";
import { Text } from "../ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Link } from "../ui/link";
import { InsightResponse } from "@/lib/insights-api";
import { format } from "date-fns";

interface InsightsCardProps {
  id: string;
  topic: string;
  content: string;
  createdAt: string;
}

export function InsightsList({ insights }: { insights: InsightResponse[] }) {
  return (
    <>
      <View className="pb-2">
        <Text className="text-xl font-semibold">Últimos Insights</Text>
      </View>

      {insights.map((insight) => (
        <InsightsItem key={insight.id} {...insight} />
      ))}
    </>
  );
}

export function InsightsItem({ topic, content, createdAt }: InsightsCardProps) {
  return (
    <Link
      href={{
        pathname: "/insights/[category]",
        params: { category: topic },
      }}
      className="bg-white p-4 rounded-2xl w-full gap-3"
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
      <View className="gap-1">
        <View className="flex flex-row justify-between items-center">
          <Text>{topic}</Text>

          <HugeiconsIcon icon={ArrowRight01Icon} size={24} />
        </View>

        <View className="flex flex-row text-2xs gap-1">
          <Text className="font-semibold">Data:</Text>
          <Text className=" text-gray-400">
            {format(new Date(createdAt), "HH:mm - dd/MM/yy")}
          </Text>
        </View>
      </View>

      <Text numberOfLines={2} ellipsizeMode="tail">
        {content}
      </Text>
    </Link>
  );
}
