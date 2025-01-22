import React, { useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { CameraView, CameraType, CameraCapturedPicture } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";

function PhotoCapture({
  setCameraPhoto,
  setGalleryPhoto,
  setStep,
}: {
  setCameraPhoto: React.Dispatch<
    React.SetStateAction<CameraCapturedPicture | null>
  >;
  setGalleryPhoto: React.Dispatch<
    React.SetStateAction<ImagePicker.ImagePickerAsset | null>
  >;
  setStep: React.Dispatch<
    React.SetStateAction<"capture" | "preview" | "finalize">
  >;
}) {
  const [facing, setFacing] = useState<CameraType>("back");
  const cameraRef = useRef<CameraView>(null);

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [9, 16],
    });

    if (!result.canceled) {
      setGalleryPhoto(result.assets[0]);
      setCameraPhoto(null); // Clear the camera photo if you switch sources
      setStep("preview");
    }
  };

  const capturePhoto = async () => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true };
      const capturedPhoto = await cameraRef.current.takePictureAsync(options);
      setCameraPhoto(capturedPhoto ?? null);
      setGalleryPhoto(null); // Clear the gallery photo if you switch sources
      setStep("preview");
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View className="flex-1 justify-center">
      <CameraView style={{ flex: 1 }} facing={facing} ref={cameraRef}>
        <View className="absolute bottom-12 left-0 right-0 flex-row items-center w-full bg-transparent justify-around">
          <TouchableOpacity
            className="p-4 bg-black/10 rounded-full"
            onPress={pickFromGallery}
          >
            <FontAwesome name="picture-o" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={capturePhoto}
            className="border-4 border-white rounded-full"
          >
            <View className="bg-white rounded-full size-16 border-4" />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-4 bg-black/10 rounded-full"
            onPress={toggleCameraFacing}
          >
            <FontAwesome6 name="rotate" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

export default PhotoCapture;
