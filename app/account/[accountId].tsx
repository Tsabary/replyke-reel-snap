import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  EntityProvider,
  handleError,
  useFeedData,
  useFetchFollow,
  useFetchSingleUser,
  useFetchUserFollowersCount,
  useFetchUserFollowingCount,
  UserAvatar,
  UserLean,
  useUser,
} from "replyke-rn";
import AntDesign from "@expo/vector-icons/AntDesign";

import AccountStats from "../../components/account/AccountStats";
import AccountFollowButton from "../../components/account/AccountFollowButton";
import AccountBio from "../../components/account/AccountBio";
import AccountSkeletons from "../../components/account/AccountSkeletons";
import AccountUsername from "../../components/account/AccountUsername";
import AccountHeaderUnfollowButton from "../../components/account/AccountHeaderUnfollowButton";
import { SinglePost } from "../../components/SinglePost";
import AccountExternalUrl from "../../components/account/AccountExternalUrl";
import AccountName from "../../components/account/AccountName";

const LIST_HEADER_COMPONENT_PADDING = 36;

const Account = () => {
  const router = useRouter();
  const { accountId } = useLocalSearchParams();

  const { user } = useUser();
  const { entities } = useFeedData({ userId: accountId as string });

  const [listHeight, setListHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const fetchSingleUser = useFetchSingleUser();
  const fetchFollow = useFetchFollow();
  const fetchUserFollowers = useFetchUserFollowersCount();
  const fetchUserFollowing = useFetchUserFollowingCount();

  const [account, setAccount] = useState<UserLean>();
  const [isUserFollowed, setIsUserFollowed] = useState<boolean | null>(null);
  const [followStats, setFollowStats] = useState<{
    followers: number;
    following: number;
  } | null>(null);
  const followChecked = useRef<boolean | null>(null);
  const followStatsChecked = useRef<boolean | null>(null);

  // Animated Value to track scrolling
  const scrollY = useRef(new Animated.Value(0)).current;

  const [isUserFollowComplete, setIsUserFollowComplete] = useState<
    boolean | null
  >(null);
  const [isUserUnfollowComplete, setIsUserUnfollowComplete] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    if (!accountId || typeof accountId !== "string") return;

    (async () => {
      const singleUser = await fetchSingleUser({ userId: accountId });
      setAccount(singleUser);
    })();
  }, [accountId]);

  useEffect(() => {
    (async () => {
      if (!user || followChecked.current) return;
      try {
        const isFollowing = await fetchFollow({ userId: accountId as string });
        setIsUserFollowed(isFollowing);
      } catch (err) {
        console.error("Error checking follow status:", err);
      } finally {
        followChecked.current = true;
      }
    })();
  }, [fetchFollow, user]);

  useEffect(() => {
    (async () => {
      if (followStatsChecked.current) return;
      try {
        followStatsChecked.current = true;

        const followersCount = await fetchUserFollowers(accountId as string);
        const followingCount = await fetchUserFollowing(accountId as string);

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
  }, [accountId, fetchUserFollowers, fetchUserFollowing]);

  const renderHeader = () =>
    account && followStats ? (
      <>
        <View
          className="items-center mt-8"
          onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
        >
          <UserAvatar user={account} size={120} borderRadius={16} />
          <AccountUsername account={account} />
          <AccountStats account={account} followStats={followStats} />
        </View>
        <AccountFollowButton
          isUserFollowed={isUserFollowed}
          isUserFollowComplete={isUserFollowComplete}
          setIsUserFollowComplete={setIsUserFollowComplete}
          isUserUnfollowComplete={isUserUnfollowComplete}
          setIsUserUnfollowComplete={setIsUserUnfollowComplete}
        />
        <View className="gap-2 mt-6">
          <AccountBio account={account} />
          <AccountExternalUrl account={account} />
        </View>
      </>
    ) : (
      <AccountSkeletons />
    );

  return (
    <>
      <StatusBar style="dark" backgroundColor="#fff" />
      <SafeAreaView className="flex-1 bg-white">
        {/* Back Navigation | Name | Options */}
        <View className="flex-row items-center px-2">
          <View className="w-1/5">
            <Pressable onPress={router.back} className="p-2">
              <AntDesign name="arrowleft" size={24} color="#1c1917" />
            </Pressable>
          </View>
          <View className="flex-1 items-center">
            <AccountName account={account} />
          </View>
          <View className="w-1/5 justify-end">
            <AccountHeaderUnfollowButton
              isUserFollowed={isUserFollowed}
              isUserFollowComplete={isUserFollowComplete}
              setIsUserFollowComplete={setIsUserFollowComplete}
              isUserUnfollowComplete={isUserUnfollowComplete}
              setIsUserUnfollowComplete={setIsUserUnfollowComplete}
            />
          </View>
        </View>

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
            bounces={false}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default Account;
