import React from "react";
import { Text } from "react-native";
import { UserLean } from "replyke-rn";

function AccountName({ account }: { account: UserLean | undefined }) {
  if (account?.name) {
    return (
      <Text
        numberOfLines={1}
        className="text-xl font-semibold text-center text-stone-900"
      >
        {account.name}
      </Text>
    );
  }

  return null;
}

export default AccountName;
