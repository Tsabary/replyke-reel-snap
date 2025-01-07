import React, { useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useUser } from "replyke-rn";
import validator from "validator";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { cn } from "../../../utils/cn";

const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const EditExternalUrl = () => {
  const router = useRouter();
  const { user, updateUser } = useUser();

  const [url, setUrl] = useState("");
  const [updating, setUpdating] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState<null | boolean>(null);

  const savePermitted = isValidUrl === true;

  const handleUpdateUrl = async () => {
    if (updating || !savePermitted) return;
    setUpdating(true);

    try {
      await updateUser?.({ metadata: { ...user?.metadata, externalUrl: url } });

      router.back(); // Navigate back only after success
    } catch (error: any) {
      console.error("Error updating name:", error?.errors || error);
    } finally {
      setUpdating(false); // Reset the loading state
    }
  };

  const debouncedCheckUrl = useCallback(
    debounce((value: string) => {
      setIsValidUrl(validator.isURL(value));
    }, 1500),
    []
  );

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setIsValidUrl(null); // Reset validity state while typing
    debouncedCheckUrl(value);
  };

  useEffect(() => {
    if (user?.metadata.externalUrl) {
      setUrl(user.metadata.externalUrl);
    }
  }, [user]);

  return (
    <>
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

          <Text className="text-xl font-bold">External URL</Text>

          <View className="flex-1 justify-end">
            {updating ? (
              <ActivityIndicator className="self-end mx-6" />
            ) : (
              <Pressable
                disabled={!savePermitted}
                onPress={handleUpdateUrl}
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
        <View className="px-5 py-3 flex-row items-baseline border-b border-gray-200">
          <Text className="text-gray-500">https://</Text>
          <TextInput
            value={url}
            onChangeText={handleUrlChange}
            className="flex-1 text-left pl-0"
            placeholder="yourwebsite.com"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        {isValidUrl === false && (
          <Text className="text-red-500 text-sm px-6 mt-2">
            Please enter a valid URL.
          </Text>
        )}
        {isValidUrl === true && (
          <Text className="text-blue-600 text-sm px-6 mt-2">
            This URL is valid.
          </Text>
        )}
      </SafeAreaView>
    </>
  );
};

export default EditExternalUrl;
