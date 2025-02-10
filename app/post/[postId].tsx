import React, { useEffect, useState } from "react";
import { Animated, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entity, EntityProvider, useFetchSingleEntity } from "@replyke/expo";
import { StatusBar } from "expo-status-bar";

import useSheetManager from "../../hooks/useSheetManager";
import { SinglePost } from "../../components/shared/SinglePost";

function PostScreen() {
  const { postId, commentId } = useLocalSearchParams();
  const { openCommentSectionSheet, setHighlightedCommentsId } =
    useSheetManager();

  const fetchSingleEntity = useFetchSingleEntity();

  const [entity, setEntity] = useState<Entity>();
  const [viewHeight, setViewHeight] = useState(0);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    (async () => {
      if (
        !postId ||
        typeof postId !== "string" ||
        entity?.id === postId ||
        !fetchSingleEntity
      )
        return;

      const fetchedEntity = await fetchSingleEntity({ entityId: postId });
      if (fetchedEntity) setEntity(fetchedEntity);
      if (commentId && typeof commentId === "string") {
        setHighlightedCommentsId?.(commentId);

        timeout = setTimeout(() => {
          openCommentSectionSheet?.(postId);
        }, 1000);
      }
    })();
    return () => clearTimeout(timeout);
  }, [postId, commentId, fetchSingleEntity]);

  if (!entity) return;
  return (
    <>
      <StatusBar style="light" backgroundColor="#000" />
      <SafeAreaView className="flex-1">
        <View
          onLayout={(event) => setViewHeight(event.nativeEvent.layout.height)}
          className="flex-1"
        >
          <EntityProvider entity={entity}>
            <SinglePost
              listHeight={viewHeight}
              scrollY={new Animated.Value(0)}
              index={0}
            />
          </EntityProvider>
        </View>
      </SafeAreaView>
    </>
  );
}

export default PostScreen;
