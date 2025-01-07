import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { handleError, useFollowUser } from "replyke-rn";
import { useLocalSearchParams } from "expo-router";

const AccountFollowButton = ({
  isUserFollowed,
  isUserFollowComplete,
  setIsUserFollowComplete,
  isUserUnfollowComplete,
  setIsUserUnfollowComplete,
}: {
  isUserFollowed: boolean | null;
  isUserFollowComplete: boolean | null;
  setIsUserFollowComplete: (value: boolean) => void;
  isUserUnfollowComplete: boolean | null;
  setIsUserUnfollowComplete: (value: boolean) => void;
}) => {
  const { accountId } = useLocalSearchParams();

  const followUser = useFollowUser();

  const handleFollowUser = async () => {
    try {
      await followUser({ userId: accountId as string });
      setIsUserFollowComplete(true);
      setIsUserUnfollowComplete(false);
    } catch (err) {
      handleError(err, "Following user failed");
    }
  };

  if ((isUserFollowed || isUserFollowComplete) && !isUserUnfollowComplete)
    return (
      <View className="flex-row justify-center items-center gap-3 bg-gray-300 self-center w-56 p-4 rounded-lg mt-5">
        <Text className="text-gray-700">Following</Text>
      </View>
    );

  return (
    <TouchableOpacity
      onPress={handleFollowUser}
      className="bg-red-500 self-center w-56 p-4 rounded-lg mt-5"
    >
      <Text className="text-white text-center">Follow</Text>
    </TouchableOpacity>
  );
};

export default AccountFollowButton;
