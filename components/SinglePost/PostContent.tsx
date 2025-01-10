import { View, ScrollView, Text } from "react-native";
import React from "react";
import { Entity } from "replyke-rn";

const PostContent = ({
  entity,
  aspectRatio,
}: {
  entity: Entity;
  aspectRatio?: string | number | undefined;
}) => {
  return (
    <View
      className="flex-1 px-6 pt-20 pb-0 justify-center"
      style={{
        backgroundColor: entity.metadata.backgroundColor,
        aspectRatio,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1, // Ensure the container fills the available height
          justifyContent: "center",
          paddingBottom: 72, // Padding for the bottom
        }}
        scrollEnabled={false} // Disable scrolling
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 24,
            textAlign: "center",
            color: entity.metadata.textColor,
          }}
        >
          {entity.content}
        </Text>
      </ScrollView>
    </View>
  );
};

export default PostContent;
