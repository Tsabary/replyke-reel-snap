import { View, Text, Pressable } from "react-native";
import React from "react";
import { useUser } from "replyke-rn";
import { useRouter } from "expo-router";
import AccountExternalUrl from "../account/AccountExternalUrl";

const ProfileExternalUrl = () => {
  const router = useRouter();
  const { user } = useUser();

  if (user?.metadata?.externalUrl) {
    return <AccountExternalUrl account={user} />;
  }

  return (
    <View className="items-center">
      <Pressable
        onPress={() => {
          router.navigate("/profile/edit-external-url");
        }}
        className="bg-gray-200 rounded py-1 px-2"
      >
        <Text className="text-gray-600">+ Add link</Text>
      </Pressable>
    </View>
  );
};

export default ProfileExternalUrl;
