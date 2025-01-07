import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Redirect } from "expo-router";
import {
  EntityProvider,
  handleError,
  useUser,
  useFeedData,
  useFetchUserFollowersCount,
  useFetchUserFollowingCount,
  UserAvatar,
  useAuth,
} from "replyke-rn";

import AccountStats from "../../../components/account/AccountStats";
import AccountSkeletons from "../../../components/account/AccountSkeletons";
import { SinglePost } from "../../../components/SinglePost";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import ProfileUsername from "../../../components/profile/ProfileUsername";
import ProfileBio from "../../../components/profile/ProfileBio";
import ProfileExternalUrl from "../../../components/profile/ProfileExternalUrl";
import { cn } from "../../../utils/cn";

const LIST_HEADER_COMPONENT_PADDING = 36;

const Profile = () => {
  const { user } = useUser();
  const { entities } = useFeedData({ userId: user?.id });

  const [listHeight, setListHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const fetchUserFollowers = useFetchUserFollowersCount();
  const fetchUserFollowing = useFetchUserFollowingCount();

  const [followStats, setFollowStats] = useState<{
    followers: number;
    following: number;
  } | null>(null);
  const followStatsChecked = useRef<boolean | null>(null);

  // Animated Value to track scrolling
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      if (!user || followStatsChecked.current) return;
      try {
        followStatsChecked.current = true;

        const followersCount = await fetchUserFollowers(user.id);
        const followingCount = await fetchUserFollowing(user.id);

        if (followersCount && followingCount) {
          setFollowStats({
            followers: followersCount.count,
            following: followingCount.count,
          });
        }
      } catch (err) {
        handleError(err, "Fetching follow stats failed");
      }
    })();
  }, [user, fetchUserFollowers, fetchUserFollowing]);

  const renderHeader = () =>
    user && followStats ? (
      <>
        <View
          className="items-center mt-8"
          onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
        >
          <UserAvatar user={user} size={120} borderRadius={16} />
          <ProfileUsername />
          <AccountStats account={user} followStats={followStats} />
        </View>

        <View
          className={cn(
            "gap-2 mt-6",
            !user.bio && !user.metadata?.externalUrl
              ? "flex-row justify-center"
              : ""
          )}
        >
          <ProfileBio />
          <ProfileExternalUrl />
        </View>
      </>
    ) : (
      <AccountSkeletons />
    );

  return (
    <>
      <StatusBar style="dark" backgroundColor="white" />
      <SafeAreaView className="flex-1 bg-white">
        {/* Back Navigation | Name | Options */}
        <ProfileHeader />
        <View
          className="flex-1"
          onLayout={(event) => {
            // if (listHeight === 0)
            setListHeight(event.nativeEvent.layout.height);
          }}
        >
          <Animated.FlatList
            data={entities}
            renderItem={({ item: entity, index }) => (
              <EntityProvider entity={entity}>
                <SinglePost
                  scrollY={scrollY}
                  index={index}
                  listHeight={listHeight}
                  headerHeight={
                    headerHeight + LIST_HEADER_COMPONENT_PADDING * 3
                  } // Tripple seems to adjust it perfectly, not sure why
                />
              </EntityProvider>
            )}
            keyExtractor={(e) => e.id}
            ListHeaderComponent={renderHeader}
            ListHeaderComponentStyle={{
              paddingBottom: LIST_HEADER_COMPONENT_PADDING,
            }}
            onEndReachedThreshold={0.5}
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
            ListEmptyComponent={
              <View className="flex-1">
                <Text className="text-center text-3xl font-bold text-gray-300 mt-6">No contributions yet</Text>
              </View>
            }
            bounces={false}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default () => {
  const { loadingInitial } = useAuth();
  const { user } = useUser();

  if (loadingInitial) return null;
  if (!user) return <Redirect href="/authenticate" />;
  return <Profile />;
};
