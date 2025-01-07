import { Pressable } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";

const HomeButton = ({
  isFocused,
  navigateToTab,
}: {
  isFocused: boolean;
  label: string;
  navigateToTab: () => void;
}) => {
  return (
    <Pressable onPress={navigateToTab} className="items-center p-3">
      <Entypo name="home" size={28} color={isFocused ? "white" : "gray"} />
      {/* <Text className="text-xs text-white">{label}</Text> */}
    </Pressable>
  );
};

export default HomeButton;
