import { View } from "react-native";
import React from "react";
import { Skeleton } from "replyke-rn";

const AccountSkeletons = () => {
  return (
    <View className="items-center">
      <View className="items-center mt-8">
        <Skeleton style={{ height: 120, width: 120 }} />

        <View className="mt-3">
          <Skeleton style={{ height: 24, width: 120 }} />
        </View>
        <View className="flex-row justify-center gap-8 mt-6">
          <View className="items-center gap-1">
            <Skeleton style={{ height: 24, width: 36 }} />
            <Skeleton style={{ height: 16, width: 48 }} />
          </View>
          <View className="items-center gap-1">
            <Skeleton style={{ height: 24, width: 36 }} />
            <Skeleton style={{ height: 16, width: 48 }} />
          </View>
          <View className="items-center gap-1">
            <Skeleton style={{ height: 24, width: 36 }} />
            <Skeleton style={{ height: 16, width: 48 }} />
          </View>
        </View>
      </View>
      <View className="self-center mt-5">
        <Skeleton style={{ height: 48, width: 224 }} />
      </View>
      <View className="gap-2 p-6">
        <Skeleton style={{ height: 16, width: 120 }} />
        <Skeleton style={{ height: 16, width: 120 }} />
      </View>
    </View>
  );
};

export default AccountSkeletons;
