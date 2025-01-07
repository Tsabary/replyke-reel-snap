import { View, Text, Dimensions, Keyboard } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { SignUpFlow } from "./SignUpFlow";
import ContinueWithoutAccount from "./ContinueWithoutAccount";
import LegalNotice from "./LegalNotice";
import { cn } from "../../utils/cn";

const { width } = Dimensions.get("window");

const SignUpContainer = ({
  signUpStage,
  setSignUpStage,
  slideToLogin,
}: {
  signUpStage: "email" | "password";
  setSignUpStage: React.Dispatch<React.SetStateAction<"email" | "password">>;
  slideToLogin: () => void;
}) => {
  const emailPasswordSignUpRef = useRef<{ resetSignup: () => void }>(null);
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
      <View
        className={cn(
          "flex-1 py-8",
          !isKeyboardVisible ? "justify-around" : ""
        )}
      >
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
            {signUpStage === "email"
              ? "Sign up for\nReplyke app"
              : signUpStage === "password"
              ? "Pick a\nPassword"
              : signUpStage === "verification"
              ? "Enter verification code"
              : null}
          </Animated.Text>
        </View>

        <View className="gap-1">
          <SignUpFlow
            ref={emailPasswordSignUpRef}
            signUpStage={signUpStage}
            setSignUpStage={setSignUpStage}
          />
          {!isKeyboardVisible && <ContinueWithoutAccount />}
        </View>
      </View>

      {/* Legal small print */}
      {!isKeyboardVisible && <LegalNotice />}

      {/* Go to Login */}
      <View className="h-20 bg-gray-100 justify-center items-center">
        <Text className="">
          Already have an account?{" "}
          <Text onPress={slideToLogin} className="font-semibold">
            Log in
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SignUpContainer;
