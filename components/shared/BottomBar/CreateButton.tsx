import React from "react";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

const CreateButton = () => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => {
        router.navigate(`/create-post`);
      }}
      className="items-center justify-center h-14 aspect-square bg-white rounded-3xl shrink-0"
    >
      <Entypo name="plus" size={24} color="black" />
    </Pressable>
  );
};

export default CreateButton;
