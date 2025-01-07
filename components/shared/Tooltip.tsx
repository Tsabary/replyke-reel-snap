import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Tooltip = ({
  message,
  children,
}: {
  message: string;
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View className="relative flex-1 z-10">
      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        onBlur={() => setVisible(false)}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>

      {visible && (
        <View className="absolute top-8 left-0 bg-gray-950 px-4 py-3 rounded-md max-w-[80%]">
          <Text className="text-white">{message}</Text>
        </View>
      )}
    </View>
  );
};

export default Tooltip;
