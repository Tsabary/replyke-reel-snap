import React, { useEffect, useState } from "react";
import { Pressable, Text, View, Image, TouchableOpacity } from "react-native";
import { useUser, useUploadFile } from "@replyke/expo";
import { UserAvatar } from "@replyke/ui-core-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import BackNavigation from "../../../components/shared/BackNavigation";
import { resizeIfNeeded } from "../../../utils/resizeIfNeeded";

const editProfile = () => {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const uploadFile = useUploadFile();

  const [avatarUri, setAvatarUri] = useState(user?.avatar || null); // Current avatar URL
  const [tempAvatarUri, setTempAvatarUri] = useState<string | null>(null); // Temporary new avatar URI
  const [uploading, setUploading] = useState(false);

  const handleChooseFile = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // Specify media types directly
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // Type guard to check if the result is successful
    if (!result.canceled) {
      setTempAvatarUri(result.assets[0].uri); // `assets[0].uri` contains the image URI
    }
  };

  const handleCancel = () => {
    setTempAvatarUri(null); // Reset the temporary avatar
  };

  const handleSave = async () => {
    if (!tempAvatarUri || !user) return;

    setUploading(true);
    try {
      // Resize to ensure neither side exceeds 800
      const { uri, extension } = await resizeIfNeeded(tempAvatarUri);

      // In React Native, we provide the shape {uri, type, name}:
      const rnFile = {
        uri: uri,
        type: `image/${extension}`, // Use the extracted extension
        name: `${Date.now()}.${extension}`, // Dynamically include the file extension
      };

      const pathParts = ["avatars", user.id];
      const uploadResponse = await uploadFile(rnFile, pathParts);

      if (uploadResponse) {
        setAvatarUri(uploadResponse.publicPath);
        await updateUser?.({ avatar: uploadResponse.publicPath });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
      setTempAvatarUri(null);
    }
  };

  useEffect(() => {
    if (!user) router.navigate("/(tabs)");
  }, [user]);

  if (!user) return;

  return (
    <>
      <StatusBar style="dark" backgroundColor="#f5f5f4" />
      <SafeAreaView className="flex-1 bg-stone-100">
        <BackNavigation title="Edit profile" />
        <View className="items-center p-12">
          <View className="relative w-32 h-32">
            {tempAvatarUri ? (
              <>
                <View className="overflow-hidden rounded-2xl">
                  <Image
                    source={{ uri: tempAvatarUri }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                {uploading ? (
                  <View className="absolute h-full w-full bg-black/40 z-20 items-center justify-center overflow-hidden rounded-2xl">
                    <View className="animate-spin">
                      <FontAwesome5 name="spinner" size={20} color="white" />
                    </View>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={handleCancel}
                      disabled={uploading}
                      className="size-10 bg-gray-400 border-4 border-stone-100 absolute -left-4 rounded-full aspect-square -bottom-4 items-center justify-center"
                    >
                      <FontAwesome6 name="xmark" size={18} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSave}
                      disabled={uploading}
                      className="size-10 bg-blue-400 border-4 border-stone-100 absolute -right-4 rounded-full aspect-square -bottom-4 items-center justify-center"
                    >
                      <FontAwesome5 name="check" size={14} color="white" />
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : (
              <View className="overflow-hidden rounded-2xl">
                <Pressable
                  onPress={handleChooseFile}
                  className="absolute h-full w-full bg-black/40 z-20 items-center justify-center"
                >
                  <Feather name="camera" size={24} color="white" />
                </Pressable>
                <View className="overflow-hidden w-32 h-32 rounded-2xl">
                  <UserAvatar
                    user={{ ...user, avatar: avatarUri }}
                    size={128}
                    borderRadius={16}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
        <View className="p-4 bg-white rounded-xl m-3 gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="font-bold">Name</Text>
            <Pressable
              onPress={() => {
                router.navigate("/profile/edit-name");
              }}
              className="flex-row gap-1 items-center py-2"
            >
              {user.name ? (
                <Text className="text-gray-500">{user.name}</Text>
              ) : (
                <Text className="text-blue-500">Set your name</Text>
              )}
              <Entypo name="chevron-right" size={18} color="#6b7280" />
            </Pressable>
          </View>
          <View className="flex-row items-center gap-4 justify-between w-full">
            <Text className="font-bold">Username</Text>
            <Pressable
              onPress={() => {
                router.navigate("/profile/edit-username");
              }}
              className="flex-row gap-1 items-center py-2"
            >
              {user.username ? (
                <Text className="text-gray-500">{user.username}</Text>
              ) : (
                <Text className="text-blue-500">Set your username</Text>
              )}
              <Entypo name="chevron-right" size={18} color="#6b7280" />
            </Pressable>
          </View>
          <View className="flex-row items-center gap-4 justify-between w-full">
            <Text className="font-bold">Bio</Text>
            <Pressable
              onPress={() => {
                router.navigate("/profile/edit-bio");
              }}
              className="flex-row gap-1 items-center py-2 flex-1 justify-end"
            >
              {user.bio ? (
                <Text
                  className="text-gray-500 text-ellipsis flex-1 text-right"
                  numberOfLines={1}
                >
                  {user.bio}
                </Text>
              ) : (
                <Text className="text-blue-500">Set your bio</Text>
              )}
              <Entypo name="chevron-right" size={18} color="#6b7280" />
            </Pressable>
          </View>
          <View className="flex-row items-center gap-4 justify-between w-full">
            <Text className="font-bold">External link</Text>
            <Pressable
              onPress={() => {
                router.navigate("/profile/edit-external-url");
              }}
              className="flex-row gap-1 items-center py-2 flex-1 justify-end"
            >
              {user.metadata?.externalUrl ? (
                <Text
                  className="text-gray-500 text-ellipsis flex-1 text-right"
                  numberOfLines={1}
                >
                  {user.metadata?.externalUrl}
                </Text>
              ) : (
                <Text className="text-blue-500">Add a link</Text>
              )}
              <Entypo name="chevron-right" size={18} color="#6b7280" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default editProfile;
