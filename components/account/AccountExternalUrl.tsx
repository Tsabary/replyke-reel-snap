import { View, Text, TouchableWithoutFeedback } from "react-native";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { UserLean } from "replyke-rn";
import Feather from "@expo/vector-icons/Feather";

const AccountExternalUrl = ({ account }: { account: UserLean }) => {
  const handlePress = async () => {
    if (account.metadata.externalUrl) {
      await WebBrowser.openBrowserAsync(
        "https://" + account.metadata.externalUrl
      );
    }
  };

  if (account.metadata.externalUrl) {
    return (
      <View className="flex-row items-center justify-center gap-2">
        <Feather name="link-2" size={16} color="#2563eb" className="pt-1" />
        <TouchableWithoutFeedback onPress={handlePress}>
          <Text className="text-blue-600">
            {account.metadata.externalUrl.length > 20
              ? account.metadata.externalUrl.substring(0, 20) + "..."
              : account.metadata.externalUrl}
          </Text>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  return null;
};

export default AccountExternalUrl;
