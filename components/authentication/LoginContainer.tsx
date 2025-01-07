import { View, Text, Dimensions, Keyboard } from "react-native";
import React, { useEffect, useState } from "react";
import LoginFlow from "./LoginFlow";
import ContinueWithoutAccount from "./ContinueWithoutAccount";
import LegalNotice from "./LegalNotice";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { cn } from "../../utils/cn";

const { width } = Dimensions.get("window");

const LoginContainer = ({ slideToSignup }: { slideToSignup: () => void }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Shared values for animation
  const textSize = useSharedValue(72); // Default text size

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
      textSize.value = withTiming(48, { duration: 600 }); // Animate text size
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
      textSize.value = withTiming(72, { duration: 600 }); // Restore text size
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [textSize]);

  // Animated styles
  const textAnimatedStyle = useAnimatedStyle(() => ({
    fontSize: textSize.value,
    lineHeight: textSize.value,
  }));

  return (
    <View style={{ width }} className="flex-1 overflow-hidden">
      <View className="flex-1 justify-around">
        <View
          className={cn(
            "relative justify-center",
            isKeyboardVisible ? "" : "min-h-72"
          )}
        >

          {/* Centered Text */}
          <Animated.Text
            className={cn("text-center px-6 tracking-tighter")}
            style={[
              textAnimatedStyle,
              {
                fontFamily: "Playfair",
                fontWeight: 600,
              },
            ]}
          >
            Log in to{"\n"}Replyke app
          </Animated.Text>
        </View>

        <View className="gap-4">
          <LoginFlow />
          {!isKeyboardVisible && <ContinueWithoutAccount />}
        </View>
      </View>

      {/* Legal small print */}
      {!isKeyboardVisible && <LegalNotice />}

      {/* Go to Signup */}
      <View className="h-20 bg-gray-100 justify-center items-center">
        <Text className="">
          Don't have an account?{" "}
          <Text onPress={slideToSignup} className="font-semibold">
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginContainer;
