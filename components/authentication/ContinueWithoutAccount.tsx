import { Text, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const ContinueWithoutAccount = () => {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.navigate("/(tabs)")}>
      <Text className="text-center text-sm text-gray-500 underline">
        Or continue without an account
      </Text>
    </Pressable>
  );
};

export default ContinueWithoutAccount;
