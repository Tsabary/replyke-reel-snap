import React, { useEffect, useRef, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  TextInput,
  Text,
  ActivityIndicator,
} from "react-native";
import { handleError, useAuth, useCreateEntity, useUser } from "replyke-rn";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, useRouter } from "expo-router";
import { showMessage } from "react-native-flash-message";
import { StatusBar } from "expo-status-bar";
import { colorKit } from "reanimated-color-picker";

function CreatePost() {
  const router = useRouter();
  const { loadingInitial } = useAuth();
  const { user } = useUser();

  const submitting = useRef(false);
  const [submittingState, setSubmittingState] = useState(false);

  const createEntity = useCreateEntity();
  const [content, setContent] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#fff");
  const [textColor, setTextColor] = useState("#fff");

  const config: Record<string, any> = {
    backgroundColor,
    textColor,
  };

  const textInputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const handleCreateEntity = async () => {
    if (submitting.current) return;
    if (!content) {
      showMessage({
        message: "Oops! Empty post",
        description: "Please add more content to your post.",
        type: "warning",
      });
      return;
    }
    submitting.current = true;
    setSubmittingState(true);
    try {
      await createEntity?.({ content: content.trim(), metadata: config });
      if (router.canGoBack()) router.back();
    } catch (err) {
      submitting.current = false;
      setSubmittingState(false);
      handleError(err, "Creating entity failed");
    }
  };

  useEffect(() => {
    const initialBackground = colorKit.randomRgbColor().hex();
    const initialTextColor = colorKit.invert(initialBackground).hex();

    setBackgroundColor(initialBackground);
    setTextColor(initialTextColor);
  }, []);

  if (loadingInitial) return null;
  if (!user) return <Redirect href="/authenticate" />;

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" backgroundColor="black" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
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
          <TouchableWithoutFeedback
            className="flex-1"
            onPress={() => textInputRef.current?.focus()}
          >
            <View className="flex-1 p-4 py-16 justify-center">
              <View className="relative w-full">
                {!content && !focused && (
                  <Text
                    style={{
                      color: textColor,
                      textAlign: "center",
                      fontSize: 36,
                    }}
                    className="w-full absolute top-0 left-0"
                  >
                    Write something
                  </Text>
                )}
                <TextInput
                  ref={textInputRef}
                  value={content}
                  onChangeText={(val) => {
                    if (val.length <= 3000) setContent(val);
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{
                    width: "100%",
                    color: textColor,
                    textAlign: "center",
                    fontSize: 36,
                  }}
                  className="caret-gray-500"
                  multiline
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default CreatePost;
