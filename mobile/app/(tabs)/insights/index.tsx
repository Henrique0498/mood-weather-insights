import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import Header from "@/components/Header";
import Chat from "@/components/Chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InsightsList } from "@/components/Insights";
import EmptyInsights from "@/components/EmptyInsigths";

export default function InsightsIndexScreen() {
  const insets = useSafeAreaInsets();
  const isEmpty = !Boolean(insights.length);
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
          {(isEmpty && <EmptyInsights />) || (
            <InsightsList insights={insights} />
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
          <Chat isEmpty={isEmpty} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const insights = [
  {
    id: "1",
    topic: "Trabalho",
    content:
      "!Loren ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    createdAt: "10:30 - 12/08/25",
  },
  {
    id: "2",
    topic: "Trabalho",
    content:
      "!Loren ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    createdAt: "10:30 - 12/08/25",
  },
  {
    id: "3",
    topic: "Trabalho",
    content:
      "!Loren ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    createdAt: "10:30 - 12/08/25",
  },
  {
    id: "4",
    topic: "Trabalho",
    content:
      "!Loren ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    createdAt: "10:30 - 12/08/25",
  },
  {
    id: "5",
    topic: "Trabalho",
    content:
      "!Loren ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    createdAt: "10:30 - 12/08/25",
  },
];
