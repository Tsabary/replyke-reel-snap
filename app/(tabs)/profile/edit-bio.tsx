import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUser } from "replyke-rn";
import { StatusBar } from "expo-status-bar";
import { cn } from "../../../utils/cn";

const AddBio = () => {
  const router = useRouter();
  const { user, updateUser } = useUser();

  const [bio, setBio] = useState("");
  const [updating, setUpdating] = useState(false);

  const savePermitted = bio.length <= 120 && user?.bio !== bio;

  const handleUpdateBio = async () => {
    if (updating || !savePermitted) return;
    setUpdating(true);

    try {
      await updateUser?.({ bio });

      router.back(); // Navigate back only after success
    } catch (error: any) {
      console.error("Error updating name:", error?.errors || error);
    } finally {
      setUpdating(false); // Reset the loading state
    }
  };

  useEffect(() => {
    if (user) setBio(user.bio || "");
  }, [user]);

  useEffect(() => {
    if (!user) router.navigate("/(tabs)");
  }, [user]);

  return (
    <>
      <StatusBar style="dark" backgroundColor="#fff" />
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center border-b border-gray-200">
          <View className="flex-1">
            <Pressable
              onPress={() => {
                router.back();
              }}
              className="py-4 px-6"
            >
              <Text className="text-lg font-medium">Cancel</Text>
            </Pressable>
          </View>

          <Text className="text-xl font-bold">Bio</Text>

          <View className="flex-1 justify-end">
            {updating ? (
              <ActivityIndicator className="self-end mx-6" />
            ) : (
              <Pressable
                disabled={!savePermitted}
                onPress={handleUpdateBio}
                className="py-4 px-6"
              >
                <Text
                  className={cn(
                    "text-lg text-right font-medium",
                    !savePermitted ? "text-gray-400" : "text-blue-600"
                  )}
                >
                  Save
                </Text>
              </Pressable>
            )}
          </View>
        </View>
        <View className="px-5 py-3 border-b border-gray-200">
          <TextInput
            value={bio}
            onChangeText={(value) => {
              if (value.length > 120) return;
              setBio(value);
            }}
            placeholder="Add a bio"
            placeholderTextColor="#9ca3af"
            className="text-lg h-36"
            numberOfLines={5}
            multiline
            style={{ textAlignVertical: "top" }} // Aligns placeholder text to the top
          />
        </View>
        <Text
          className={cn(
            "my-2 px-6",
            bio.length === 120 ? "text-red-500" : "text-gray-500"
          )}
        >
          {bio.length}/120
        </Text>
      </SafeAreaView>
    </>
  );
};

export default AddBio;
