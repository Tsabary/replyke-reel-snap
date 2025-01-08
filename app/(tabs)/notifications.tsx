import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  Text,
  View,
} from "react-native";
import { useAppNotifications, useAuth, useUser } from "replyke-rn";
import { useCallback, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";

import BackNavigation from "../../components/shared/BackNavigation";
import { groupNotifications } from "../../helpers/groupNotifications";
import { SingleNotification } from "../../components/notifications/SingleNotification";

function Notifications() {
  const {
    appNotifications,
    hasMore,
    loading,
    resetAppNotifications,
    loadMore,
  } = useAppNotifications();
  const [refreshing, setRefreshing] = useState(false);
  const [listHeight, setListHeight] = useState(0);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await resetAppNotifications?.();
    setRefreshing(false);
  }, [resetAppNotifications]);

  const groupedNotifications = useMemo(() => {
    return groupNotifications(appNotifications!);
  }, [appNotifications]);

  return (
    <>
      <StatusBar style="dark" backgroundColor="#fff" />
      <SafeAreaView className="flex-1 bg-white">
        <BackNavigation title="Notifications" />

        <View
          className="flex-1"
          onLayout={(event) => setListHeight(event.nativeEvent.layout.height)}
        >
          <SectionList
            sections={groupedNotifications}
            renderItem={({ item }) => (
              <SingleNotification notification={item} />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text className="text-gray-900 text-xl font-bold px-4 py-2">
                {title}
              </Text>
            )}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReached={() => {
              if (!hasMore) return;
              loadMore?.();
            }}
            onEndReachedThreshold={0}
            ListEmptyComponent={
              hasMore ? null : (
                <View
                  className="flex-1"
                  style={{
                    height: listHeight,
                    backgroundColor: "white",
                    justifyContent: "center",
                  }}
                >
                  <Text className="text-center text-xl font-medium text-gray-400">
                    Nothing here yet
                  </Text>
                  <Text className="text-center text-lg text-gray-400 mt-2">
                    Get out there and the notifications will roll in!
                  </Text>
                </View>
              )
            }
            ListFooterComponent={
              hasMore && loading && groupedNotifications.length > 0 ? (
                <View
                  style={{
                    padding: 12,
                    justifyContent: "center", // Center vertically
                    alignItems: "center", // Center horizontally
                  }}
                >
                  <ActivityIndicator />
                </View>
              ) : null
            }
          />
        </View>
      </SafeAreaView>
    </>
  );
}

export default () => {
  const { loadingInitial } = useAuth();
  const { user } = useUser();

  if (loadingInitial) return null;
  if (!user) return <Redirect href="/authenticate" />;

  return <Notifications />;
};
