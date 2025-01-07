import { View, Text } from "react-native";
import React from "react";
import { cn } from "../../utils/cn";

const EmptyFlatList = ({
  text,
  bgColor,
  textColor,
  textShadowColor,
}: {
  text: string;
  bgColor: string;
  textColor: string;
  textShadowColor: string;
}) => {
  return (
    <View className={cn("h-full p-4 justify-center", bgColor)}>
      <Text
        style={{
          fontFamily: "Bungee",
          fontSize: 32,
          textAlign: "center",
          color: textColor,
          textShadowColor,
          textShadowOffset: { width: 3, height: 3 },
          textShadowRadius: 1,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

export default EmptyFlatList;
