import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Entity } from "replyke-rn";
import { SvgUri } from "react-native-svg";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import useSheetManager from "../../hooks/useSheetManager";

const SingleBookmark = ({ entity }: { entity: Partial<Entity> }) => {
  const router = useRouter();
  const { closeSaveToListSheet } = useSheetManager();

  return (
    <Pressable
      onPress={() => {
        router.push(`/post/${entity.id}`);
        closeSaveToListSheet?.();
      }}
      className="px-4 py-2.5 flex-row gap-3 items-center"
    >
      <View className="bg-gray-700 rounded-2xl aspect-square h-10 items-center justify-center">
        {entity.metadata?.icon ? (
          <>
            {entity.metadata.icon.endsWith(".svg") ? (
              <View className="w-5 h-5 rounded-xl shrink-0 grow-0 overflow-hidden items-center justify-center">
                <SvgUri uri={entity.metadata.icon} width={17} height={17} />
              </View>
            ) : (
              <Image
                className="w-[20px] h-[20px] rounded-xl shrink-0 grow-0"
                source={{
                  uri: entity.metadata.icon,
                }}
              />
            )}
          </>
        ) : (
          <FontAwesome name="bookmark" size={20} color="#fff" />
        )}
      </View>
      <Text className="text-gray-800 text-ellipsis flex-1" numberOfLines={1}>
        {entity.title ?? entity.content?.replace(/\n+/g, " ")}
      </Text>
    </Pressable>
  );
};

export default SingleBookmark;
