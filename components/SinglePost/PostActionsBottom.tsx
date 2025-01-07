import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useUser, useEntity, useIsEntitySaved, UserAvatar } from "replyke-rn";
import { useRouter } from "expo-router";
import { showMessage } from "react-native-flash-message";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

import useSheetManager from "../../hooks/useSheetManager";
import { formatNumber } from "../../utils/formatNumber";
import PostFollowButton from "./PostFollowButton";
import PostCommentsTeaser from "./PostCommentsTeaser";

const PostActionsBottom = () => {
  const router = useRouter();
  const { user } = useUser();
  const { entity, userUpvotedEntity, upvoteEntity, removeEntityUpvote } =
    useEntity();
  const { entityIsSaved, checkIfEntityIsSaved } = useIsEntitySaved();
  const { openCommentSectionDrawer, openSaveToListSheet, openSharePostSheet } =
    useSheetManager();

  useEffect(() => {
    if (entityIsSaved === null) {
      checkIfEntityIsSaved(entity!.id);
    }
  }, [checkIfEntityIsSaved, entityIsSaved]);

  if (!entity) return null;
  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["transparent", "rgba(0,0,0,0.8)"]}
      className="absolute left-0 bottom-0 right-0"
    >
      <View className="px-6 py-4 gap-2">
        <PostCommentsTeaser />
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-8">
            {/* Author */}
            <View className="relative">
              <Pressable
                onPress={() =>
                  entity.user!.id === user?.id
                    ? router.navigate("/(tabs)/profile")
                    : router.navigate(`/account/${entity.user!.id}`)
                }
              >
                <UserAvatar user={entity.user} size={36} borderRadius={18} />
              </Pressable>
              <PostFollowButton positionClassname="-right-2 top-2" />
            </View>

            {/* LIKE BUTTON */}
            <TouchableOpacity
              onPress={() => {
                if (!user) {
                  showMessage({
                    message: "Oops! Login Required",
                    description:
                      "Please sign in or create an account to continue.",
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
              className="items-center flex-row gap-2"
            >
              <AntDesign
                name="heart"
                size={24}
                color={userUpvotedEntity ? "#F43F5E" : "#ffffff80"}
              />

              <Text
                className="text-white/75 text-lg overflow-visible"
                style={{
                  fontFamily: "Roboto",
                }}
              >
                {formatNumber(entity?.upvotes.length)}
              </Text>
            </TouchableOpacity>

            {/* OPEN COMMNENT SECTION */}
            <TouchableOpacity
              onPress={() => openCommentSectionDrawer?.(entity.id)}
              className="items-center flex-row gap-2"
            >
              <Ionicons name="chatbubble" size={24} color="#ffffff80" />
              {(entity.repliesCount || 0) > 0 && (
                <Text
                  className="text-white/75 text-lg overflow-visible"
                  style={{
                    fontFamily: "Roboto",
                  }}
                >
                  {formatNumber(entity?.repliesCount)}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center gap-8">
            {/* BOOKMARK BUTTON */}
            <TouchableOpacity
              onPress={() =>
                user
                  ? openSaveToListSheet?.(entity.id)
                  : showMessage({
                      message: "Oops! Login Required",
                      description:
                        "Please sign in or create an account to continue.",
                      type: "warning",
                    })
              }
            >
              <FontAwesome
                name="bookmark"
                size={24}
                color={entityIsSaved ? "#fff" : "#ffffff80"}
              />
            </TouchableOpacity>

            {/* SHARE BUTTON */}
            <TouchableOpacity onPress={() => openSharePostSheet?.(entity)}>
              <Ionicons name="arrow-redo" size={26} color="#ffffff80" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default PostActionsBottom;
