import { TopicInsightResponse } from "@/lib/insights-topic-api";
import { View } from "react-native";
import { Text } from "../ui/text";
import { Link } from "../ui/link";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { format } from "date-fns";

export function TopicsList({ topics }: { topics: TopicInsightResponse[] }) {
  return (
    <>
      <View className="pb-2">
        <Text className="text-xl font-semibold">Últimos Insights</Text>
      </View>

      {topics.map((topic) => (
        <TopicInsight key={topic.id} {...topic} />
      ))}
    </>
  );
}

export function TopicInsight({ createdAt, topic }: TopicInsightResponse) {
  return (
    <Link
      href={{
        pathname: "/insights/[category]",
        params: { category: topic },
      }}
      className="bg-white p-4 rounded-2xl w-full gap-1"
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
      <View className="flex flex-row justify-between items-center">
        <Text className="capitalize">{topic}</Text>

        <HugeiconsIcon icon={ArrowRight01Icon} size={24} />
      </View>

      <View className="flex flex-row text-2xs gap-1">
        <Text className="font-semibold">Data:</Text>
        <Text className=" text-gray-400">
          {format(new Date(createdAt), "HH:mm - dd/MM/yy")}
        </Text>
      </View>
    </Link>
  );
}
