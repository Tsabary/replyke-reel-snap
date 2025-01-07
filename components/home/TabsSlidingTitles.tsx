import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from "react-native-reanimated";

interface TabsSlidingTitlesProps {
  titles: string[];
  translateX: SharedValue<number>;
  screenWidth: number;
  onTitlePress: (index: number) => void; // Add this prop
}

export const TabsSlidingTitles: React.FC<TabsSlidingTitlesProps> = ({
  titles,
  translateX,
  screenWidth,
  onTitlePress,
}) => {
  // Calculate the total width of the titles including gaps
  const titleWidth = screenWidth / 4; // Adjust this to control individual title width
  const gap = 16; // Gap between titles

  const animatedTitlesStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          translateX.value,
          titles.map((_, index) => -index * screenWidth),
          titles.map(
            (_, index) =>
              index * (titleWidth + gap) * -1 +
              (screenWidth - titleWidth - gap) / 2
          )
        ),
      },
    ],
  }));

  return (
    <View className="absolute top-0 left-0 right-0">
      <View className="relative h-16 justify-center">
        {/* Static underline */}
        <View
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-24 rounded-md bg-white/50 z-30"
          style={{
            shadowColor: "#00000099",
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 0 },
            elevation: 4,
          }}
        />

        {/* Animated row of titles */}
        <Animated.View
          style={animatedTitlesStyle}
          className="absolute flex-row items-center left-0"
        >
          {titles.map((title, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => onTitlePress(index)} // Handle press event
            >
              <Text
                className="text-lg font-bold text-center"
                style={{
                  width: titleWidth,
                  marginHorizontal: gap / 2,
                  color: "white",
                  textShadowColor: "#00000099",
                  textShadowRadius: 2,
                  textShadowOffset: { width: 0, height: 0 },
                }}
              >
                {title}
              </Text>
            </TouchableWithoutFeedback>
          ))}
        </Animated.View>
      </View>
    </View>
  );
};
