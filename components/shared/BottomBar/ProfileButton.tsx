import React from "react";
import { Pressable } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const ProfileButton = ({
  isFocused,
  navigateToTab,
}: {
  isFocused: boolean;
  label: string;
  navigateToTab: () => void;
}) => {
  return (
    <Pressable onPress={navigateToTab} className="items-center p-3">
      <FontAwesome5
        name="user-alt"
        size={22}
        color={isFocused ? "#fff" : "gray"}
      />
      {/* <Text className="text-xs text-white">{label}</Text> */}
    </Pressable>
  );
};

export default ProfileButton;
