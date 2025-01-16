import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import { handleError, useAuth, useCreateEntity, useUser } from "replyke-rn";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

const CONTENT =
  "This placeholder represents where your users can create and upload posts. Customize it to match your app’s purpose—whether that’s images, videos, recipes, or anything else your platform is built for. The functionality here is entirely up to you, designed to reflect the kind of content you want your users to share!";
function CreatePost() {
  const router = useRouter();
  const { loadingInitial } = useAuth();
  const { user } = useUser();

  const submitting = useRef(false);
  const [submittingState, setSubmittingState] = useState(false);

  const createEntity = useCreateEntity();
  const [backgroundColor, setBackgroundColor] = useState("#fff");
  const [textColor, setTextColor] = useState("#fff");

  const config: Record<string, any> = {
    backgroundColor,
    textColor,
  };

  const handleCreateEntity = async () => {
    if (submitting.current) return;

    submitting.current = true;
    setSubmittingState(true);
    try {
      await createEntity?.({ content: CONTENT, metadata: config });
      if (router.canGoBack()) router.back();
    } catch (err) {
      submitting.current = false;
      setSubmittingState(false);
      handleError(err, "Creating entity failed");
    }
  };

  useEffect(() => {
    const generateColors = () => {
      const randomHex = (): string =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, "0");

      const randomColor = `#${randomHex()}${randomHex()}${randomHex()}`;

      const invertedColor = `#${
        randomColor
          .slice(1)
          .match(/.{2}/g) // Split into pairs of two hex digits
          ?.map((component) =>
            (255 - parseInt(component, 16)).toString(16).padStart(2, "0")
          )
          .join("") ?? "ffffff"
      }`; // Default to white if match is null

      setBackgroundColor(randomColor);
      setTextColor(invertedColor);
    };

    generateColors();
  }, []);

  if (loadingInitial) return null;
  if (!user) return <Redirect href="/authenticate" />;

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" backgroundColor="black" />

      <View className="flex-1" style={{ backgroundColor }}>
        <View className="flex-1 absolute top-0 left-0 right-0 z-50 flex-row justify-end p-3">
          {submittingState ? (
            <ActivityIndicator />
          ) : (
            <Pressable onPress={handleCreateEntity} className="p-3">
              <Text
                className="text-xl text-white tracking-wide"
                style={{
                  textShadowColor: "#00000066",
                  textShadowRadius: 6,
                  textShadowOffset: { width: 0, height: 0 },
                }}
              >
                Publish
              </Text>
            </Pressable>
          )}
        </View>

        <View className="flex-1 p-4 py-16 justify-center">
          <Text
            style={{
              color: textColor,
              textAlign: "center",
              fontSize: 24,
            }}
          >
            {CONTENT}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default CreatePost;
