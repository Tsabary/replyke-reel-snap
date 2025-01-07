import { View, Text, Pressable } from "react-native";
import React from "react";
import { useUser } from "replyke-rn";
import { useRouter } from "expo-router";
import AccountUsername from "../account/AccountUsername";

const ProfileUsername = () => {
  const router = useRouter();
  const { user } = useUser();

  if (user?.username) {
    return <AccountUsername account={user} />;
  }

  return (
    <View className="mt-3">
      <Pressable
        onPress={() => {
          router.navigate("/profile/edit-username");
        }}
        className="bg-gray-200 rounded py-1 px-2"
      >
        <Text className="text-gray-600">+ Add username</Text>
      </Pressable>
    </View>
  );
};

export default ProfileUsername;
