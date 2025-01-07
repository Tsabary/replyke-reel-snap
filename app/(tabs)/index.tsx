import React, { useState, useEffect } from "react";
import { Dimensions, View } from "react-native";
import { FeedProvider, useUser } from "replyke-rn";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import Feed from "../../components/home/Feed";
import { cn } from "../../utils/cn";
import { TabsSlidingTitles } from "../../components/home/TabsSlidingTitles";
import { FEEDS, feedTitles } from "../../components/home/feeds";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type ScreenCount = 1 | 2 | 3 | 4;
const containerWidth: Record<ScreenCount, string> = {
  1: "w-full",
  2: "w-[200%]",
  3: "w-[300%]",
  4: "w-[400%]",
};

const Home = () => {
  const { user } = useUser();

  // Keep your original React state for the active feed:
  const [currentIndex, setCurrentIndex] = useState<number>(1); // start on the second feed

  // Keep a shared value in sync with that state:
  const currentIndexSV = useSharedValue(currentIndex);

  // On each render if currentIndex changes, update currentIndexSV
  useEffect(() => {
    currentIndexSV.value = currentIndex;
  }, [currentIndex]);

  // TranslateX starts at -SCREEN_WIDTH for feed #1
  const translateX = useSharedValue(-SCREEN_WIDTH);

  const screenCount = feedTitles.length;

  // -- GESTURE HANDLER (Swipe) --

  const handleGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const minTranslateX = -(screenCount - 1) * SCREEN_WIDTH;
    const maxTranslateX = 0;

    translateX.value = Math.min(
      maxTranslateX,
      Math.max(
        minTranslateX,
        event.nativeEvent.translationX + currentIndexSV.value * -SCREEN_WIDTH
      )
    );
  };

  const handleGestureEnd = () => {
    const threshold = SCREEN_WIDTH / 5;

    const newIndex =
      translateX.value > -(currentIndexSV.value * SCREEN_WIDTH) + threshold
        ? Math.max(currentIndexSV.value - 1, 0)
        : translateX.value < -(currentIndexSV.value * SCREEN_WIDTH) - threshold
        ? Math.min(currentIndexSV.value + 1, screenCount - 1)
        : currentIndexSV.value;

    // Update both React state and shared value
    setCurrentIndex(newIndex);
    currentIndexSV.value = newIndex;

    translateX.value = withSpring(newIndex * -SCREEN_WIDTH, {
      damping: 20,
      stiffness: 150,
      mass: 1,
      overshootClamping: true,
    });
  };

  // -- TITLE TAPS (Click) --
  const handleTitlePress = (index: number) => {

    // if (index === currentIndexSV.value) return;

    setCurrentIndex(index);
    // Immediately update the shared value so the gesture code sees the correct feed
    currentIndexSV.value = index;

    translateX.value = withSpring(index * -SCREEN_WIDTH, {
      damping: 20,
      stiffness: 150,
      mass: 1,
      overshootClamping: true,
    });
  };

  // Animated style that just uses translateX
  const animatedFeedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <>
      <StatusBar style="light" backgroundColor="#000" />
      <SafeAreaView className="relative flex-1">
        <View className="relative z-20">
          <TabsSlidingTitles
            titles={feedTitles}
            translateX={translateX}
            screenWidth={SCREEN_WIDTH}
            onTitlePress={handleTitlePress}
          />
        </View>

        <PanGestureHandler
          onGestureEvent={handleGestureEvent}
          onEnded={handleGestureEnd}
          activeOffsetX={[-20, 20]}
        >
          <Animated.View
            style={animatedFeedStyle}
            className={cn(
              "flex-1 flex-row",
              containerWidth[screenCount as ScreenCount]
            )}
          >
            {FEEDS(user).map((feed, index) => (
              <View key={index} className="flex-1 w-screen">
                {feed.component || (
                  <FeedProvider {...feed.providerProps}>
                    <Feed />
                  </FeedProvider>
                )}
              </View>
            ))}
          </Animated.View>
        </PanGestureHandler>
      </SafeAreaView>
    </>
  );
};

export default Home;
