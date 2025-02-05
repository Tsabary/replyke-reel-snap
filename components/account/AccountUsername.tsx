import React from "react";
import { View, Text } from "react-native";
import { UserLean } from "@replyke/expo";

const AccountUsername = ({ account }: { account: UserLean }) => {
  if (account.username) {
    return (
      <View className="mt-3">
        <Text className="text-xl font-semibold text-center text-stone-900s">
          @{account.username}
        </Text>
      </View>
    );
  }

  return null;
};

export default AccountUsername;
