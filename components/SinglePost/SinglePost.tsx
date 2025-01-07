import { Pressable, Animated } from "react-native";
import React, { useState } from "react";
import { useEntity, useUser } from "replyke-rn";
import useSheetManager from "../../hooks/useSheetManager";
import PostActionsBottom from "./PostActionsBottom";
import PostContent from "./PostContent";

const SinglePost = ({
  listHeight,
  headerHeight = 0,
  scrollY,
  index,
}: {
  listHeight: number;
  headerHeight?: number;
  scrollY: Animated.Value;
  index: number;
}) => {
  const { user } = useUser();
  const { entity } = useEntity();
  const { openPostOptionsSheet, openOwnerPostOptionsSheet } = useSheetManager();

  const metadata = entity?.metadata;

  if (!metadata) return null;

  const translateY = scrollY.interpolate({
    inputRange: [
      (index - 1) * listHeight + headerHeight, // Previous post
      index * listHeight + headerHeight, // Current post (fully visible)
      (index + 1) * listHeight + headerHeight, // Next post
    ],
    outputRange: [0, 0, 100], // Moves down as post scrolls out
    extrapolate: "clamp",
  });

  const opacity = scrollY.interpolate({
    inputRange: [
      (index - 0.5) * listHeight + headerHeight, // Start fading out earlier
      index * listHeight + headerHeight, // Fully visible
      (index + 0.5) * listHeight + headerHeight, // Almost faded out
    ],
    outputRange: [0, 1, 0], // Adjust to ensure quicker fade in and out
    extrapolate: "clamp",
  });

  return (
    <>
      <Pressable
        onLongPress={() => {
          console.log("entity.user?.id", entity.user?.id);
          console.log("user?.id", user?.id);
          entity.user?.id === user?.id
            ? openOwnerPostOptionsSheet?.(entity)
            : openPostOptionsSheet?.(entity);
        }}
        className="relative"
        style={{ height: listHeight }}
      >
        <PostContent entity={entity} />

        {/* Post Actions Bottom with Animation */}
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            transform: [{ translateY }],
            opacity,
          }}
        >
          <PostActionsBottom />
        </Animated.View>
      </Pressable>
    </>
  );
};

export default SinglePost;
