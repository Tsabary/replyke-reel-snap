import { Image, Pressable, Text, View } from "react-native";
import { CameraCapturedPicture } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import AntDesign from "@expo/vector-icons/AntDesign";

function PhotoPreview({
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
}) {
  return (
    <View className="flex-1 bg-black">
      <Image
        source={{ uri: (cameraPhoto ?? galleryPhoto)?.uri }}
        className="flex-1"
        resizeMode="cover"
      />
      <View className="flex-1 absolute top-0 left-0 right-0 z-50 flex-row justify-between p-5">
        <Pressable
          onPress={() => {
            resetCreateScreen();
          }}
          className="px-3 py-2 flex-row items-center gap-2 bg-black/20 rounded-2xl"
        >
          <AntDesign name="arrowleft" size={16} color="white" />
          <Text className="text-lg tracking-wide text-white">Preview</Text>
        </Pressable>
        <Pressable
          onPress={() => setStep("finalize")}
          className="p-3 bg-black/20 rounded-2xl"
        >
          <Text
            className="text-xl text-white tracking-wide"
            style={{
              textShadowColor: "#00000066",
              textShadowRadius: 4,
              textShadowOffset: { width: 0, height: 0 },
            }}
          >
            Next
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default PhotoPreview;
