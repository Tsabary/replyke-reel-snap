import React from "react";
import { View, Text, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";

const RequestPermission = ({
  requestPermission,
}: {
  requestPermission: () => Promise<ImagePicker.PermissionResponse>;
}) => {
  return (
    <View className="flex-1">
      <View className="flex-1 justify-center">
        <Text className="pb-2.5 text-center">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    </View>
  );
};

export default RequestPermission;
