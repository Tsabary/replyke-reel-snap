import { Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const CreateButton = () => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => {
        router.navigate(`/create-post`);
      }}
      className="items-center justify-center h-14 aspect-square bg-white rounded-3xl shrink-0"
    >
      <FontAwesome5 name="pencil-alt" size={24} color="black" />
    </Pressable>
  );
};

export default CreateButton;
