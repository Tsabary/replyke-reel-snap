import React from "react";
import { Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const ListsButton = ({
  isFocused,
  navigateToTab,
}: {
  isFocused: boolean;
  label: string;
  navigateToTab: () => void;
}) => {
  return (
    <Pressable onPress={navigateToTab} className="items-center p-3">
      <FontAwesome
        name="bookmark"
        size={24}
        color={isFocused ? "white" : "gray"}
      />
      {/* <Text className="text-xs text-white">{label}</Text> */}
    </Pressable>
  );
};

export default ListsButton;
