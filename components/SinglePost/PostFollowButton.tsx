import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  handleError,
  useAuth,
  useEntity,
  useFetchFollow,
  useFollowUser,
  useUser,
} from "replyke-rn";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { showMessage } from "react-native-flash-message";
import { cn } from "../../utils/cn";

const PostFollowButton = ({
  positionClassname,
}: {
  positionClassname: string;
}) => {
  const [isUserFollowed, setIsUserFollowed] = useState<boolean | null>(null);
  const [isUserFollowComplete, setIsUserFollowComplete] = useState(false);
  const followChecked = useRef<boolean | null>(null);

  const { loadingInitial } = useAuth();
  const { user } = useUser();
  const { entity } = useEntity();

  const followUser = useFollowUser();
  const fetchFollow = useFetchFollow();

  const handleFollowUser = async () => {
    try {
      setIsUserFollowComplete(true);
      await followUser({ userId: entity!.user!.id });
    } catch (err) {
      setIsUserFollowComplete(false);

      handleError(err, "Following user failed");
    }
  };

  useEffect(() => {
    (async () => {
      if (
        !user ||
        !entity ||
        user.id === entity.user?.id ||
        followChecked.current
      )
        return;
      try {
        const isFollowing = await fetchFollow({ userId: entity!.user?.id });
        setIsUserFollowed(isFollowing);
      } catch (err) {
        console.error("Error checking follow status:", err);
      } finally {
        followChecked.current = true;
      }
    })();
  }, [fetchFollow, user, entity]);

  const followButton = (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        user
          ? handleFollowUser()
          : showMessage({
              message: "Oops! Login Required",
              description: "Please sign in or create an account to continue.",
              type: "warning",
            });
      }}
      className={cn("absolute", positionClassname)}
    >
      <View className="justify-center items-center h-6 w-6 bg-rose-500 rounded-md">
        <Entypo name="plus" size={14} color="#fff" />
      </View>
    </TouchableOpacity>
  );

  const followCompleteIndicator = (
    <View className={cn("absolute", positionClassname)}>
      <View className="justify-center items-center h-6 w-6 bg-gray-400 rounded-md">
        <FontAwesome name="check" size={12} color="#fff" />
      </View>
    </View>
  );

  if (
    loadingInitial ||
    isUserFollowed === null ||
    isUserFollowed ||
    !entity ||
    user?.id === entity.user?.id
  )
    return null;

  if (isUserFollowComplete) return followCompleteIndicator;

  return followButton;
};

export default PostFollowButton;
