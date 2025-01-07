import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

import { cn } from "../../utils/cn";

const BackNavigation = ({
  title,
  onPress,
  children,
  absolute,
  className,
}: {
  title: string;
  onPress?: () => void;
  children?: React.ReactNode;
  absolute?: boolean;
  className?: string;
}) => {
  const router = useRouter();

  return (
    <View
      className={cn(
        "flex-row items-center",
        absolute ? "absolute left-0 top-0 right-0" : "",
        className
      )}
    >
      <View className="flex-1">
        <Pressable onPress={onPress ?? router.back} className="p-4">
          <AntDesign name="arrowleft" size={24} color="#1c1917" />
        </Pressable>
      </View>
      <Text className="flex-1 text-xl text-center font-semibold text-stone-900">
        {title}
      </Text>
      <View className="flex-1">{children}</View>
    </View>
  );
};

export default BackNavigation;
