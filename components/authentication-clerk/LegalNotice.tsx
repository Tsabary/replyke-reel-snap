import React from "react";
import { Text, View } from "react-native";
import { Link, useRouter } from "expo-router";

function LegalNotice() {
  const router = useRouter();

  return (
    <View className="p-6">
      <Text className="text-gray-400 text-sm">
        By continuing you acknowledge that you understand the{" "}
        <Link
          href="https://www.replyke.com" // TODO: Change to a ink to your privacy policy
          className="font-semibold text-black"
        >
          Privacy Policy
        </Link>{" "}
        {/* and{" "}
        <Text
          onPress={() => router.navigate("/privacy-policy")}
          className="font-semibold text-blue-400"
        >
          Terms and Conditions
        </Text> */}
      </Text>
    </View>
  );
}

export default LegalNotice;
