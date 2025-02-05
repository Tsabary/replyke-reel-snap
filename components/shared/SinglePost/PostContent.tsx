import React from "react";
import { Image } from "react-native";
import { Entity } from "@replyke/expo";

const PostContent = ({
  entity,
  aspectRatio,
}: {
  entity: Entity;
  aspectRatio?: string | number | undefined;
}) => {
  return (
    <Image
      source={{ uri: entity.media[0].publicPath }}
      className="flex-1"
      resizeMode="cover"
      style={{
        aspectRatio,
      }}
    />
  );
};

export default PostContent;
