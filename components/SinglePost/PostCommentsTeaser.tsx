import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { getUserName, useEntity } from "replyke-rn";
import useSheetManager from "../../hooks/useSheetManager";

const PostCommentsTeaser = () => {
  const { entity } = useEntity();
  const { openCommentSectionDrawer } = useSheetManager();

  if (!entity || !entity.topComment) return null;

  return (
    <TouchableOpacity
      className="gap-1.5 py-1"
      activeOpacity={0.6}
      onPress={() => openCommentSectionDrawer?.(entity.id)}
    >
      {entity.topComment && (
        <Text className="text-gray-200" numberOfLines={2}>
          <Text className="font-semibold">
            {getUserName(entity.topComment.user || {})}
          </Text>{" "}
          {entity.topComment.content}
        </Text>
      )}
      {/* <Text className="text-gray-500">View all comments..</Text> */}
    </TouchableOpacity>
  );
};

export default PostCommentsTeaser;
