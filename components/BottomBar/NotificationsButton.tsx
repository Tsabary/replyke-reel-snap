import React from "react";
import { Pressable, Text, View } from "react-native";
import { useAppNotifications } from "replyke-rn";
import Entypo from "@expo/vector-icons/Entypo";

const NotificationsButton = ({
  isFocused,
  navigateToTab,
}: {
  isFocused: boolean;
  label: string;
  navigateToTab: () => void;
}) => {
  const { unreadAppNotificationsCount } = useAppNotifications();

  return (
    <Pressable onPress={navigateToTab} className="items-center p-3">
      <View className="relative">
        <Entypo name="bell" size={24} color={isFocused ? "white" : "gray"} />
        {!!unreadAppNotificationsCount && (
          <View className="absolute -top-1 -right-1 bg-red-500 flex justify-center items-center rounded-full aspect-square size-5">
            <Text className="text-xs text-white">
              {unreadAppNotificationsCount}
            </Text>
          </View>
        )}
      </View>
      {/* <Text className="text-xs text-white">{label}</Text> */}
    </Pressable>
  );
};

export default NotificationsButton;
