import { useLists } from "@replyke/expo";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Skeleton } from "@replyke/ui-core-react-native";

function SubCollections() {
  const { subLists, loading, openList } = useLists();

  return (
    <View className="py-5">
      {loading ? (
        <FlatList
          data={[1, 2]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => (
            <View className="flex-row gap-3 px-4 py-2.5 items-center">
              <Skeleton
                style={{
                  height: 36,
                  width: 36,
                  borderRadius: 20,
                  backgroundColor: "#d1d5db",
                }}
              />
              <Skeleton
                style={{
                  height: 10,
                  width: "70%",
                  borderRadius: 6,
                  backgroundColor: "#d1d5db",
                }}
              />
            </View>
          )}
        />
      ) : (
        <FlatList
          data={subLists}
          keyExtractor={(item) => item.id}
          renderItem={({ item: subList }) => (
            <Pressable
              onPress={() => openList?.(subList)}
              className="px-4 py-2.5 flex-row gap-3 items-center to-gray-500"
            >
              <View className="bg-gray-700 p-2 rounded-2xl">
                <Entypo name="list" size={20} color="#fff" />
              </View>
              <Text className="text-gray-700">{subList.name}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

export default SubCollections;
