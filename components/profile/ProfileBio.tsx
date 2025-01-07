import { View, Text, Pressable } from "react-native";
import React from "react";
import { useUser } from "replyke-rn";
import { useRouter } from "expo-router";
import AccountBio from "../account/AccountBio";

const ProfileBio = () => {
  const router = useRouter();
  const { user } = useUser();

  if (user?.bio) {
    return <AccountBio account={user} />;
  }

  return (
    <View className="items-center">
      <Pressable
        onPress={() => {
          router.navigate("/profile/edit-bio");
        }}
        className="bg-gray-200 rounded py-1 px-2"
      >
        <Text className="text-gray-600">+ Add bio</Text>
      </Pressable>
    </View>
  );
};

export default ProfileBio;
