import { View, Pressable } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import ProfleName from "./ProfileName";

const ProfileHeader = () => {
  const router = useRouter();
  return (
    <View className="flex-row items-center px-2">
      <View className="w-1/5">
        <Pressable onPress={router.back} className="p-2">
          <AntDesign name="arrowleft" size={24} color="#1c1917" />
        </Pressable>
      </View>
      <View className="flex-1 items-center">
        <ProfleName />
      </View>
      <View className="w-1/5 justify-end">
        <Pressable
          onPress={() => {
            router.navigate("/profile/settings");
          }}
          className="self-end items-center p-4"
        >
          <Ionicons name="ellipsis-vertical" size={22} color="#1c1917" />
        </Pressable>
      </View>
    </View>
  );
};

export default ProfileHeader;
