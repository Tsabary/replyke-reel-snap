import { Pressable } from "react-native";
import React from "react";
import { handleError, useUnfollowUser } from "replyke-rn";
import { useLocalSearchParams } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

const AccountHeaderUnfollowButton = ({
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

  const followUser = useUnfollowUser();

  const handleUnfollowUser = async () => {
    try {
      await followUser({ userId: accountId as string });
      setIsUserUnfollowComplete(true);
      setIsUserFollowComplete(false);
    } catch (err) {
      handleError(err, "Following user failed");
    }
  };

  if ((!isUserFollowed && !isUserFollowComplete) || isUserUnfollowComplete)
    return null;

  return (
    <Pressable
      onPress={handleUnfollowUser}
      className="self-end items-center py-2 px-4"
    >
      <Feather name="user-minus" size={22} color="#1c1917" />
    </Pressable>
  );
};

export default AccountHeaderUnfollowButton;
