import { View, Text } from "react-native";
import React from "react";
import { UserLean } from "replyke-rn";

const AccountBio = ({ account }: { account: UserLean }) => {
  if (account.bio) {
    return (
      <View className="items-center px-16">
        <Text className="text-center">{account.bio}</Text>
      </View>
    );
  }

  return null;
};

export default AccountBio;
