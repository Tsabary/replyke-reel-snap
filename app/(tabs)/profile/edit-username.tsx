import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  useCheckUsernameAvailability,
  useUser as useUserReplyke,
} from "replyke-rn";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { sanitizeUsername } from "../../../helpers/sanitizeUsername";
import { cn } from "../../../utils/cn";

const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const EditUsername = () => {
  const router = useRouter();

  const { updateUser, user } = useUserReplyke();

  const checkUsernameAvailability = useCheckUsernameAvailability();

  const [username, setUsername] = useState("");
  const [updating, setUpdating] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(
    null
  );

  const savePermitted =
    username.length > 0 &&
    username.length <= 30 &&
    usernameAvailable &&
    user?.username !== sanitizeUsername(username);

  const handleUpdateUsername = async () => {
    if (updating || !savePermitted) return;
    setUpdating(true);

    const sanitized = sanitizeUsername(username);
    try {
      await updateUser?.({ username: sanitized });

      router.back(); // Navigate back only after success
    } catch (error: any) {
      console.error("Error updating username:", error?.errors || error);
    } finally {
      setUpdating(false); // Reset the loading state
    }
  };

  const debouncedCheckUsername = useCallback(
    debounce(async (value: string) => {
      try {
        const { available } = await checkUsernameAvailability({
          username: value,
        });
        setUsernameAvailable(available);
      } catch (error) {
        console.error("Error checking username availability:", error);
        setUsernameAvailable(null);
      }
    }, 500),
    [checkUsernameAvailability]
  );

  const handleUsernameChange = (value: string) => {
    const sanitized = sanitizeUsername(value);
    if (value.length > 30) return;

    setUsername(sanitized);
    setUsernameAvailable(null); // Reset availability state before checking
    if (sanitized.length > 0 && user?.username !== sanitized) {
      debouncedCheckUsername(sanitized);
    }
  };

  useEffect(() => {
    if (user) setUsername(user.username || "");
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

          <Text className="text-xl font-bold">Username</Text>

          <View className="flex-1 justify-end">
            {updating ? (
              <ActivityIndicator className="self-end mx-6" />
            ) : (
              <Pressable
                disabled={!savePermitted}
                onPress={handleUpdateUsername}
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
            value={username}
            onChangeText={handleUsernameChange}
            className="flex-1 text-left lowercase"
            placeholder="Your username"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
          />
          <Text
            className={cn(
              "my-2 w-12 text-right",
              username.length === 30 ? "text-red-500" : "text-gray-500"
            )}
          >
            {username.length}/30
          </Text>
        </View>

        <Text className="text-gray-500 text-sm px-6 mt-2">
          Usernames can only contain letters, numbers, underscores and full
          stops.
        </Text>

        {usernameAvailable === false && (
          <Text className="text-red-500 text-sm px-6 mt-2">
            This username is already taken.
          </Text>
        )}
        {usernameAvailable === true && (
          <Text className="text-blue-600 text-sm px-6 mt-2">
            This username is available.
          </Text>
        )}
      </SafeAreaView>
    </>
  );
};

export default EditUsername;
