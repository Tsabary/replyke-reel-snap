import { useState } from "react";
import { View } from "react-native";
import { useCameraPermissions, CameraCapturedPicture } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import PhotoCapture from "../components/create-post/PhotoCapture";
import PhotoPreview from "../components/create-post/PhotoPreview";
import RequestPermission from "../components/create-post/RequestPermission";
import FinalizePost from "../components/create-post/FinalizePost";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreatePostScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  const [cameraPhoto, setCameraPhoto] = useState<CameraCapturedPicture | null>(
    null
  );
  const [galleryPhoto, setGalleryPhoto] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [step, setStep] = useState<"capture" | "preview" | "finalize">(
    "capture"
  );

  const resetCreateScreen = () => {
    setCameraPhoto(null);
    setGalleryPhoto(null);
    setStep("capture");
  };

  return (
    <SafeAreaView className="flex-1">
      {!permission ? null : !permission.granted ? ( // Camera permissions are still loading.
        // Camera permissions are not granted yet.
        <RequestPermission requestPermission={requestPermission} />
      ) : step === "finalize" && (cameraPhoto || galleryPhoto) ? (
        <FinalizePost
          setStep={setStep}
          cameraPhoto={cameraPhoto}
          galleryPhoto={galleryPhoto}
          resetCreateScreen={resetCreateScreen}
        />
      ) : step === "preview" && (cameraPhoto || galleryPhoto) ? (
        <PhotoPreview
          cameraPhoto={cameraPhoto}
          galleryPhoto={galleryPhoto}
          setStep={setStep}
          resetCreateScreen={resetCreateScreen}
        />
      ) : (
        <PhotoCapture
          setCameraPhoto={setCameraPhoto}
          setGalleryPhoto={setGalleryPhoto}
          setStep={setStep}
        />
      )}
    </SafeAreaView>
  );
}
