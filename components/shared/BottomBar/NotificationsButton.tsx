import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import {
  handleError,
  useCountUnreadNotifications,
  useUser,
} from "@replyke/expo";
import Entypo from "@expo/vector-icons/Entypo";

const NotificationsButton = ({
  isFocused,
  navigateToTab,
}: {
  isFocused: boolean;
  label: string;
  navigateToTab: () => void;
}) => {
  const { user } = useUser();
  const countUnreadNotifications = useCountUnreadNotifications();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handleFetchUnreadCount = async () => {
      try {
        const unreadCount = await countUnreadNotifications();
        setCount(unreadCount);
      } catch (err) {
        handleError(err, "Failed to fetch unread notifications count:");
      }
    };

    if (user) handleFetchUnreadCount();
  }, [user]);

  return (
    <Pressable onPress={navigateToTab} className="items-center p-3">
      <View className="relative">
        <Entypo name="bell" size={24} color={isFocused ? "white" : "gray"} />
        {count > 0 && (
          <View className="absolute -top-1 -right-1 bg-red-500 flex justify-center items-center rounded-full aspect-square size-5">
            <Text className="text-xs text-white">{count}</Text>
          </View>
        )}
      </View>
      {/* <Text className="text-xs text-white">{label}</Text> */}
    </Pressable>
  );
};

export default NotificationsButton;
