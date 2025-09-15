import { Image } from "expo-image";
import { View, Text } from "react-native";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export function Logo() {
  return (
    <View>
      <Image
        source={require("../../assets/images/icon.png")}
        style={{ width: 300, height: 200, borderRadius: 8 }}
        placeholder={blurhash}
        contentFit="cover"
        transition={1000}
      />
      <Text className={styles.title}>My Insights</Text>
    </View>
  );
}

const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold text-emerald-700 mt-4`,
};
