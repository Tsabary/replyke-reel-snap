import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
  Keyboard,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Redirect } from "expo-router";
import { useUser as useUserClerk } from "@clerk/clerk-react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { SignUpFlow } from "../components/authentication-clerk/SignUpFlow";
import LegalNotice from "../components/authentication-clerk/LegalNotice";
import LoginFlow from "../components/authentication-clerk/LoginFlow";
import ContinueWithoutAccount from "../components/authentication-clerk/ContinueWithoutAccount";

const { width } = Dimensions.get("window");

const Authenticate = () => {
  const { user: userClerk } = useUserClerk();
  // useAuth().signOut();
  const [signUpStage, setSignUpStage] = useState<
    "email" | "password" | "verification"
  >("email");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const emailPasswordSignUpRef = useRef<{ resetSignup: () => void }>(null);

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
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (userClerk) return <Redirect href="/" />;

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <Animated.View
            style={[animatedStyle, { width: width * 2 }]}
            className="flex-row flex-1"
          >
            {/* Sign up options */}
            <View style={{ width }} className="mt-12 flex-1 overflow-hidden">
              <View className="flex-1">
                <Text
                  className="text-4xl text-center p-6"
                  style={{ fontFamily: "Playfair" }}
                >
                  {signUpStage === "email"
                    ? "Sign up for Ayapo"
                    : signUpStage === "password"
                    ? "Pick a Password"
                    : signUpStage === "verification"
                    ? "Enter verification code"
                    : null}
                </Text>
                <SignUpFlow
                  ref={emailPasswordSignUpRef}
                  signUpStage={signUpStage}
                  setSignUpStage={setSignUpStage}
                />
                {!isKeyboardVisible && <ContinueWithoutAccount />}
              </View>

              {!isKeyboardVisible && (
                <>
                  {/* Legal small print */}
                  <LegalNotice />

                  {/* Go to Login */}
                  <View className="h-20 bg-gray-100 justify-center items-center">
                    <Text className="">
                      Already have an account?{" "}
                      <Text onPress={slideToLogin} className="font-semibold">
                        Log in
                      </Text>
                    </Text>
                  </View>
                </>
              )}
            </View>

            {/* Log in options */}
            <View style={{ width }} className="mt-12 flex-1 overflow-hidden">
              <View className="flex-1">
                <Text
                  className="text-4xl text-center p-6"
                  style={{ fontFamily: "Playfair" }}
                >
                  Log in to Ayapo
                </Text>
                <LoginFlow />
                {!isKeyboardVisible && <ContinueWithoutAccount />}
              </View>

              {!isKeyboardVisible && (
                <>
                  {/* Legal small print */}
                  <LegalNotice />

                  {/* Go to Signup */}
                  <View className="h-20 bg-gray-100 justify-center items-center">
                    <Text className="">
                      Don't have an account?{" "}
                      <Text onPress={slideToSignup} className="font-semibold">
                        Sign up
                      </Text>
                    </Text>
                  </View>
                </>
              )}
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default Authenticate;
