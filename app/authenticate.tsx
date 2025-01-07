import React, { useEffect, useState } from "react";
import { View, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useUser } from "replyke-rn";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import SignUpContainer from "../components/authentication/SignUpContainer";
import LoginContainer from "../components/authentication/LoginContainer";

const { width } = Dimensions.get("window");

const Authenticate = () => {
  const router = useRouter();
  const { user } = useUser();
  const [signUpStage, setSignUpStage] = useState<"email" | "password">("email");

  const translateX = useSharedValue(0);

  const slideToLogin = () => {
    translateX.value = -width; // Slide to the left
  };

  const slideToSignup = () => {
    translateX.value = 0; // Slide back to the right
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(translateX.value, { duration: 300 }) },
    ],
  }));

  useEffect(() => {
    if (user) router.back();
  }, [user]);

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="relative flex-1 gap-8 overflow-hidden">
            <Animated.View
              style={[animatedStyle, { width: width * 2 }]}
              className="flex-row flex-1 pt-12"
            >
              {/* Sign up options */}
              <SignUpContainer
                signUpStage={signUpStage}
                setSignUpStage={setSignUpStage}
                slideToLogin={slideToLogin}
              />

              {/* Log in options */}
              <LoginContainer slideToSignup={slideToSignup} />
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default Authenticate;
