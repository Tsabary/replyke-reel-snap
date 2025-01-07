import React from "react";
import { View, FlatList } from "react-native";
import { Skeleton } from "replyke-rn";

const AccountCommentsSkeletons = () => {
  return (
    <FlatList
      data={[1, 2, 3]}
      className="mt-6"
      renderItem={() => (
        <View className="py-4 px-4 gap-2 bg-gray-800 mx-4 rounded-2xl">
          <Skeleton
            style={{
              width: "80%",
              height: 16,
              borderRadius: 8,
            }}
          />
          <Skeleton
            style={{
              width: "100%",
              height: 16,
              borderRadius: 8,
            }}
          />
        </View>
      )}
      ItemSeparatorComponent={() => <View className="h-4" />}
      contentContainerStyle={{ paddingBottom: 24 }}
      keyExtractor={(i) => i.toString()}
    />
  );
};

export default AccountCommentsSkeletons;
