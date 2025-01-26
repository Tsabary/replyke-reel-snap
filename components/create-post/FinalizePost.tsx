import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useCreateEntity, useUploadFile, useUser } from "replyke-expo";
import { useRouter } from "expo-router";
import { CameraCapturedPicture } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import { resizeIfNeeded } from "../../utils/resizeIfNeeded";

const FinalizePost = ({
  cameraPhoto,
  galleryPhoto,
  setStep,
  resetCreateScreen,
}: {
  cameraPhoto: CameraCapturedPicture | null;
  galleryPhoto: ImagePicker.ImagePickerAsset | null;
  setStep: React.Dispatch<
    React.SetStateAction<"capture" | "preview" | "finalize">
  >;
  resetCreateScreen: () => void;
}) => {
  const router = useRouter();
  const { user } = useUser();
  const uploadFile = useUploadFile();
  const createEntity = useCreateEntity();
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");

  const handleUpload = async (imageUri: string) => {
    if (!imageUri || !user) return;

    setUploading(true);

    try {
      // Resize to ensure neither side exceeds 800
      const { uri, extension } = await resizeIfNeeded(imageUri);

      // 3) Prepare the file for upload (in React Native style)
      const rnFile = {
        uri: uri,
        type: `image/${extension}`,
        name: `${Date.now()}.${extension}`,
      };

      // 4) Upload the resized file to your storage:
      const pathParts = ["posts", user.id];
      const uploadResponse = await uploadFile(rnFile, pathParts);

      if (uploadResponse) {
        await createEntity({
          title: caption,
          media: [{ ...uploadResponse, extension }],
        });
      }

      // 5) Clean up & navigate away
      router.navigate("/");
      resetCreateScreen();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Pressable
        onPress={() => setStep("preview")}
        className="m-3 px-3 py-2 flex-row items-center gap-2 rounded-xl"
      >
        <AntDesign name="arrowleft" size={16} color="black" />
        <Text className="text-lg tracking-wide">New Post</Text>
      </Pressable>
      <View className="flex-1">
        <View className="h-64">
          <Image
            source={{ uri: (cameraPhoto ?? galleryPhoto)?.uri }}
            className="flex-1"
            resizeMode="cover"
          />
        </View>
        <TextInput
          value={caption}
          onChangeText={(value) => {
            if (value.length > 120) return;
            setCaption(value);
          }}
          className="m-3 text-left border-b border-gray-300"
          placeholder="Add caption.."
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
        />
        <View />
      </View>

      <TouchableOpacity
        onPress={() => handleUpload((cameraPhoto ?? galleryPhoto)!.uri)}
        disabled={uploading}
        className="px-3 py-4 flex-row items-center justify-center gap-2 rounded-xl bg-black m-3 "
      >
        {uploading && <ActivityIndicator />}
        <Text className="text-lg tracking-wide text-white text-center">
          Publish
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FinalizePost;
