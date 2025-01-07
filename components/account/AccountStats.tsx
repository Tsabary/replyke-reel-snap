import { View, Text } from "react-native";
import React from "react";
import { UserLean } from "replyke-rn";
import { formatNumber } from "../../utils/formatNumber";

const AccountStats = ({
  account,
  followStats,
}: {
  account: UserLean;
  followStats: {
    followers: number;
    following: number;
  };
}) => {
  return (
    <View className="flex-row justify-center gap-8 mt-6">
      <View className="items-center">
        <Text className="font-bold text-xl">
          {formatNumber(account.reputation)}
        </Text>
        <Text className="text-stone-500">Reputation</Text>
      </View>
      <View className="items-center">
        <Text className="font-bold text-xl">
          {formatNumber(followStats.followers)}
        </Text>
        <Text className="text-stone-500">Followers</Text>
      </View>
      <View className="items-center">
        <Text className="font-bold text-xl">
          {formatNumber(followStats.following)}
        </Text>
        <Text className="text-stone-500">Following</Text>
      </View>
    </View>
  );
};

export default AccountStats;
