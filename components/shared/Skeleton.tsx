import React, { useCallback, useEffect, useRef } from "react";

import {
  Animated,
  DimensionValue,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

type SkeletonProps = {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
  bgColor?: string;
  style?: StyleProp<ViewStyle>;
};

const Skeleton = ({
  width,
  height,
  bgColor = "#eee", // This can be any color, depending on your theme
  borderRadius = 8, // You can adjust the default borderRadius too
  style,
}: SkeletonProps) => {
  const animation = useRef(new Animated.Value(0.5)).current;

  const startAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1500, // You can adjust the time as you want
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0.5,
          duration: 1500, // You can adjust the time as you want
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animation]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  const animatedStyle = {
    opacity: animation,
    width,
    height,
    backgroundColor: bgColor,
    borderRadius,
  };

  return <Animated.View style={[style, animatedStyle]} />;
};

const BookmarkSkeleton = () => {
  return (
    <View className="flex-row gap-3 px-4 py-2.5 items-center">
      <Skeleton height={36} width={36} borderRadius={20} bgColor="#d1d5db" />
      <Skeleton height={10} width="70%" borderRadius={6} bgColor="#d1d5db" />
    </View>
  );
};

export { BookmarkSkeleton };

export default Skeleton;
