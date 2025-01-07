import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, Pressable } from "react-native";
import { useUser, useEntity, useIsEntitySaved, UserAvatar } from "replyke-rn";
import { showMessage } from "react-native-flash-message";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

import useSheetManager from "../../hooks/useSheetManager";
import PostFollowButton from "./PostFollowButton";

function PostActionsHover() {
  const router = useRouter();
  const { user } = useUser();
  const { openCommentSectionDrawer, openSaveToListSheet } = useSheetManager();

  const { entity, userUpvotedEntity, upvoteEntity, removeEntityUpvote } =
    useEntity();

  const { entityIsSaved, checkIfEntityIsSaved } = useIsEntitySaved();

  useEffect(() => {
    checkIfEntityIsSaved(entity!.id);
  }, [entity, checkIfEntityIsSaved]);

  if (!entity) return null;

  return (
    <View
      className="absolute right-4 bottom-10 z-50 items-center gap-6 bg-stone-900/20 p-3 pb-4 rounded-2xl"
      style={{ columnGap: 12 }}
    >
      {/* User avatar and follow button */}
      <View className="relative pb-2">
        <Pressable
          onPress={() => router.navigate(`/account/${entity.user!.id}`)}
        >
          <UserAvatar user={entity.user} size={46} borderRadius={8} />
        </Pressable>
        <PostFollowButton positionClassname="-bottom-1 left-0 right-0" />
      </View>

      {/* LIKE BUTTON */}
      <TouchableOpacity
        onPress={() => {
          if (!user) {
            showMessage({
              message: "Oops! Login Required",
              description: "Please sign in or create an account to continue.",
              type: "warning",
            });
            return;
          }
          if (userUpvotedEntity) {
            removeEntityUpvote?.();
          } else {
            upvoteEntity?.();
          }
        }}
        className="items-center gap-1.5"
      >
        <AntDesign
          name="heart"
          size={36}
          color={userUpvotedEntity ? "#F43F5E" : "white"}
        />

        <Text className="text-white overflow-visible">
          {entity?.upvotes.length}
        </Text>
      </TouchableOpacity>

      {/* OPEN COMMNENT SECTION */}
      <TouchableOpacity
        onPress={() => openCommentSectionDrawer?.(entity.id)}
        className="items-center gap-1.5"
      >
        <Ionicons name="chatbubble" size={36} color="#ffffff" />

        {(entity.repliesCount || 0) > 0 && (
          <Text className="text-[#9ca3af]">{entity.repliesCount}</Text>
        )}
      </TouchableOpacity>

      {/* BOOKMARK BUTTON */}
      <TouchableOpacity
        onPress={() =>
          user
            ? openSaveToListSheet?.(entity.id)
            : showMessage({
                message: "Oops! Login Required",
                description: "Please sign in or create an account to continue.",
                type: "warning",
              })
        }
      >
        <FontAwesome
          name="bookmark"
          size={32}
          color={entityIsSaved ? "#dc2626" : "#ffffff99"}
        />
      </TouchableOpacity>
    </View>
  );
}

export default PostActionsHover;
