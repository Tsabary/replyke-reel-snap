import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { ResizeMode, Video } from "expo-av";

const CreatePost: React.FC = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<{
    type: "photo" | "video";
    uri: string;
  } | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Selected from gallery:", result.assets[0]);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleCapture = async () => {
    if (cameraRef.current && !isRecording) {
      const photo = await cameraRef.current.takePhotoAsync();
      setCapturedMedia({ type: "photo", uri: photo.uri });
    }
  };

  const handleStartRecording = async () => {
    if (cameraRef.current && !isRecording) {
      setIsRecording(true);
      const video = await cameraRef.current.startRecordingAsync({
        maxDuration: 10,
      });
      setIsRecording(false);
      setCapturedMedia({ type: "video", uri: video.uri });
    }
  };

  const handleStopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  const dismissMedia = () => {
    setCapturedMedia(null);
  };

  const publishMedia = () => {
    console.log("Publishing media:", capturedMedia);
    setCapturedMedia(null);
  };

  return (
    <View style={styles.container}>
      {capturedMedia ? (
        <View style={styles.previewContainer}>
          {capturedMedia.type === "photo" ? (
            <Image source={{ uri: capturedMedia.uri }} style={styles.media} />
          ) : (
            <Video
              source={{ uri: capturedMedia.uri }}
              style={styles.media}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
            />
          )}
          <View style={styles.actionButtons}>
            <Button title="Publish" onPress={publishMedia} />
            <Button title="Dismiss" onPress={dismissMedia} />
          </View>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={(ref) => {
            cameraRef.current = ref;
          }}
        >
          <View style={styles.controls}>
            <TouchableOpacity style={styles.button} onPress={pickFromGallery}>
              <Text style={styles.text}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, isRecording && styles.recordingButton]}
              onPress={handleCapture}
              onLongPress={handleStartRecording}
              onPressOut={handleStopRecording}
            >
              <Text style={styles.text}>
                {isRecording ? "Recording..." : "Capture"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  button: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 5,
  },
  recordingButton: {
    backgroundColor: "red",
  },
  text: {
    fontSize: 16,
    color: "black",
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  media: {
    width: "100%",
    height: "80%",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
});

export default CreatePost;
