import { View, Text, Platform } from "react-native";
import React from "react";
import GoogleLogin from "./GoogleLogin";
import AppleLogin from "./AppleLogin";
import FacebookLogin from "./FacebookLogin";

const OAuthProviders = () => {
  return (
    <View className="gap-3">
      <View className="flex-row gap-3 items-center">
        <View className="h-[1px] flex-1 border-b-hairline border-gray-300" />
        <Text className="text-gray-300">or</Text>
        <View className="h-[1px] flex-1 border-b-hairline border-gray-300" />
      </View>
      {Platform.OS === "ios" && <AppleLogin />}
      <GoogleLogin />
      <FacebookLogin />
    </View>
  );
};

export default OAuthProviders;
