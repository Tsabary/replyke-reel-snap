import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { cn } from "../../utils/cn";

const CustomButton = ({
  onPress,
  text,
  activeText,
  error,
  disabled,
  className,
  submitting,
}: {
  onPress: () => void;
  text: string;
  activeText?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  submitting?: boolean;
}) => {
  const baseStyle =
    "bg-gray-950 px-4 py-4 inline-flex items-center justify-center whitespace-nowrap rounded-xl transition-colors focus-visible:outline-none";

  return (
    <View className={cn(className, "gap-1")}>
      {disabled ? (
        <View className={cn(baseStyle, "opacity-40 pointer-events-none")}>
          <Text className="text-lg font-medium text-white">
            {submitting ? activeText || text : text}
          </Text>
        </View>
      ) : (
        <TouchableOpacity onPress={onPress} className={cn(baseStyle)}>
          <Text className="text-lg font-medium text-white">
            {submitting ? activeText || text : text}
          </Text>
        </TouchableOpacity>
      )}
      {error && (
        <View className="flex-row items-center gap-1">
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#dc2626"
          />
          <Text className="text-red-600">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default CustomButton;
