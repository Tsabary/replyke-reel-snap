import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useUser } from "replyke-rn";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { cn } from "../../../utils/cn";

const EditName = () => {
  const router = useRouter();

  const { user, updateUser } = useUser();

  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);

  const savePermitted =
    name.length > 0 && name.length <= 30 && user?.name !== name;

  const handleUpdateName = async () => {
    if (updating || !savePermitted) return;
    setUpdating(true);

    try {
      await updateUser?.({ name });

      router.back(); // Navigate back only after success
    } catch (error: any) {
      console.error("Error updating name:", error?.errors || error);
    } finally {
      setUpdating(false); // Reset the loading state
    }
  };

  useEffect(() => {
    if (user) setName(user.name || "");
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

          <Text className="text-xl font-bold">Name</Text>

          <View className="flex-1 justify-end">
            {updating ? (
              <ActivityIndicator className="self-end mx-6" />
            ) : (
              <Pressable
                disabled={!savePermitted}
                onPress={handleUpdateName}
                className="py-4 px-5"
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
        <View className="px-5 py-3 flex-row items-center border-b border-gray-200">
          <TextInput
            value={name}
            onChangeText={(value) => {
              if (value.length > 30) return;
              setName(value);
            }}
            className="flex-1 text-left"
            placeholder="Your name"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
          />
          <Text
            className={cn(
              "my-2 w-12 text-right",
              name.length === 30 ? "text-red-500" : "text-gray-500"
            )}
          >
            {name.length}/30
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
};

export default EditName;
