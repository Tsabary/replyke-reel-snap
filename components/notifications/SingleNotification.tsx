import React from "react";
import { Pressable, Text, View } from "react-native";
import {
  AppNotification,
  FromNow,
  useAppNotifications,
  UserAvatar,
} from "replyke-rn";
import { useState } from "react";
import { useRouter } from "expo-router";

import { cn } from "../../utils/cn";

export function SingleNotification({
  notification: notificationParam,
}: {
  notification: AppNotification.UnifiedAppNotification;
}) {
  const router = useRouter();

  const { markNotificationAsRead } = useAppNotifications();
  const [notification, setNotification] = useState(notificationParam);

  const handlePress = () => {
    if (
      notification.action === "open-entity" &&
      "entityId" in notification.metadata
    ) {
      router.push(`/post/${notification.metadata.entityId}`);
    }

    if (
      notification.action === "open-comment" &&
      "entityId" in notification.metadata
    ) {
      router.push(
        `/post/${notification.metadata.entityId}?commentId=${notification.metadata.commentId}`
      );
    }

    if (!notification.isRead) {
      markNotificationAsRead!(notification.id);
      setNotification((prevNotif: AppNotification.UnifiedAppNotification) => ({
        ...prevNotif,
        isRead: true,
      }));
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className={cn(
        "flex-row gap-4 w-full items-start px-5 py-6 cursor-pointer",
        !notification.isRead ? "bg-blue-50" : ""
      )}
    >
      {notification.metadata?.initiatorId && (
        <UserAvatar
          user={{
            id: notification.metadata.initiatorId,
            name: notification.metadata.initiatorName,
            username: notification.metadata.initiatorUsername,
            avatar: notification.metadata.initiatorAvatar,
          }}
          size={42}
        />
      )}
      <View className="flex-1 gap-1">
        <View className="flex-row items-start gap-3">
          <Text className="text-gray-900 font-medium text-base flex-1">
            {notification.title}
          </Text>
          <Text className="mt-1">
            <FromNow time={notification.createdAt} color="#9ca3af" />
          </Text>
        </View>

        {notification.content && (
          <Text className=" opacity-65">{notification.content}</Text>
        )}
      </View>
    </Pressable>
  );
}
