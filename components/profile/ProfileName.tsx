import { Text, Pressable } from "react-native";
import React from "react";
import { useUser } from "replyke-rn";
import { useRouter } from "expo-router";
import AccountName from "../account/AccountName";

const ProfleName = () => {
  const router = useRouter();
  const { user } = useUser();

  if (user?.name) {
    return <AccountName account={user} />;
  }

  return (
    <Pressable
      onPress={() => {
        router.navigate("/profile/edit-name");
      }}
      className="bg-gray-200 rounded py-1 px-2"
    >
      <Text className="text-gray-600">+ Add name</Text>
    </Pressable>
  );
};

export default ProfleName;
