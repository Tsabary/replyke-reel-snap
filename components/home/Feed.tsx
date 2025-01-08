import React, { useCallback, useRef, useState } from "react";
import { EntityProvider, useFeed } from "replyke-rn";
import Skeleton from "../shared/Skeleton";
import { Animated, RefreshControl, View, Text } from "react-native";
import { SinglePost } from "../SinglePost";

function Feed({
  listEmptyComponent,
}: {
  listEmptyComponent?: React.JSX.Element;
}) {
  const { entities, loadMore, resetEntities, loading } = useFeed();
  const [listHeight, setListHeight] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Animated Value to track scrolling
  const scrollY = useRef(new Animated.Value(0)).current;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await resetEntities?.();
    setRefreshing(false);
  }, [resetEntities]);

  const initialLoading = loading && (!entities || entities.length === 0);

  if (initialLoading) return <Skeleton height="100%" width="100%" />;

  return (
    <View
      className="flex-1"
      onLayout={(event) => {
        if (event.nativeEvent.layout.height > listHeight)
          setListHeight(event.nativeEvent.layout.height);
      }}
    >
      <Animated.FlatList
        data={entities!}
        renderItem={({ item: entity, index }) => (
          <EntityProvider entity={entity}>
            <SinglePost
              listHeight={listHeight}
              scrollY={scrollY}
              index={index}
            />
          </EntityProvider>
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={2}
        ListFooterComponent={null}
        ListEmptyComponent={
          loading ? null : (
            <View className="flex-1" style={{ height: listHeight }}>
              {listEmptyComponent ?? (
                <View
                  className="flex-1"
                  style={{
                    backgroundColor: "white",
                    justifyContent: "center",
                  }}
                >
                  <Text className="text-center text-xl font-medium text-gray-400">
                    No Results
                  </Text>
                  <Text className="text-center text-lg text-gray-400 mt-2">
                    Try expanding your search
                  </Text>
                </View>
              )}
            </View>
          )
        }
        ItemSeparatorComponent={() => (
          <View className="h-[0.5px] bg-gray-200" />
        )}
        pagingEnabled
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        bounces={false}
      />
    </View>
  );
}

export default Feed;
