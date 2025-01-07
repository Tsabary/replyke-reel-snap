import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useUser, UserAvatar } from "replyke-rn";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

import BackNavigation from "../../../components/shared/BackNavigation";

const editProfile = () => {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user) router.navigate("/(tabs)");
  }, [user]);

  if (!user) return;

  return (
    <>
      <StatusBar style="dark" backgroundColor="#f5f5f4" />
      <SafeAreaView className="flex-1 bg-stone-100">
        <BackNavigation title="Edit profile" />
        <View className="items-center p-12">
          <UserAvatar user={user} size={96} />
        </View>
        <View className="p-4 bg-white rounded-xl m-3 gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="font-bold">Name</Text>
            <Pressable
              onPress={() => {
                router.navigate("/profile/edit-name");
              }}
              className="flex-row gap-1 items-center py-2"
            >
              {user.name ? (
                <Text className="text-gray-500">{user.name}</Text>
              ) : (
                <Text className="text-blue-500">Set your name</Text>
              )}
              <Entypo name="chevron-right" size={18} color="#6b7280" />
            </Pressable>
          </View>
          <View className="flex-row items-center gap-4 justify-between w-full">
            <Text className="font-bold">Username</Text>
            <Pressable
              onPress={() => {
                router.navigate("/profile/edit-username");
              }}
              className="flex-row gap-1 items-center py-2"
            >
              {user.username ? (
                <Text className="text-gray-500">{user.username}</Text>
              ) : (
                <Text className="text-blue-500">Set your username</Text>
              )}
              <Entypo name="chevron-right" size={18} color="#6b7280" />
            </Pressable>
          </View>
          <View className="flex-row items-center gap-4 justify-between w-full">
            <Text className="font-bold">Bio</Text>
            <Pressable
              onPress={() => {
                router.navigate("/profile/edit-bio");
              }}
              className="flex-row gap-1 items-center py-2 flex-1 justify-end"
            >
              {user.bio ? (
                <Text
                  className="text-gray-500 text-ellipsis flex-1 text-right"
                  numberOfLines={1}
                >
                  {user.bio}
                </Text>
              ) : (
                <Text className="text-blue-500">Set your bio</Text>
              )}
              <Entypo name="chevron-right" size={18} color="#6b7280" />
            </Pressable>
          </View>
          <View className="flex-row items-center gap-4 justify-between w-full">
            <Text className="font-bold">External link</Text>
            <Pressable
              onPress={() => {
                router.navigate("/profile/edit-external-url");
              }}
              className="flex-row gap-1 items-center py-2 flex-1 justify-end"
            >
              {user.metadata?.externalUrl ? (
                <Text
                  className="text-gray-500 text-ellipsis flex-1 text-right"
                  numberOfLines={1}
                >
                  {user.metadata?.externalUrl}
                </Text>
              ) : (
                <Text className="text-blue-500">Add a link</Text>
              )}
              <Entypo name="chevron-right" size={18} color="#6b7280" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default editProfile;
