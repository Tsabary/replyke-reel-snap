import "react-native-reanimated";
import "../global.css";
import { useEffect } from "react";
import { ListsProvider } from "replyke-rn";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FlashMessage from "react-native-flash-message";
import { StatusBar } from "expo-status-bar";

import ContextProvider from "../context/ContextProvider";
import { SaveToListSheet } from "../components/sheets/SaveToListSheet";
import ReportPostSheet from "../components/sheets/ReportPostSheet";
import CommentSectionSheet from "../components/sheets/CommentSectionSheet";
import PostOptionsSheet from "../components/sheets/PostOptionsSheet";
import SharePostSheet from "../components/sheets/SharePostSheet";
// import { ClerkProvider } from "@clerk/clerk-expo";
// import { tokenCache } from "../cache";
import OwnerPostOptionsSheet from "../components/sheets/OwnerPostOptionsSheet";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Playfair: require("../assets/fonts/PlayfairDisplay-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <StatusBar style="light" backgroundColor="#000" />
      <SafeAreaProvider>
        <FlashMessage
          position="top"
          statusBarHeight={Constants.statusBarHeight}
          titleStyle={{ color: "black", fontSize: 16 }}
          textStyle={{ color: "black", fontSize: 14 }}
          style={{
            backgroundColor: "#d1d5db",
          }}
        />
        {/* <ClerkProvider //TODO: uncomment if using clerk
          tokenCache={tokenCache}
          publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        > */}
        <ContextProvider>
          <Stack
            screenOptions={{
              gestureEnabled: true, // Enable swipe gestures
              animation: "default",
              presentation: "transparentModal", // or 'modal', 'card', etc.
              headerShown: false,
              contentStyle: {
                backgroundColor: "#fff",
              },
            }}
          >
            {/* Stack Navigator */}
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="authenticate" />
            <Stack.Screen name="create-post" />
          </Stack>
          <CommentSectionSheet />
          <PostOptionsSheet />
          <OwnerPostOptionsSheet />
          <ReportPostSheet />
          <SharePostSheet />
          <ListsProvider>
            <SaveToListSheet />
          </ListsProvider>
        </ContextProvider>
        {/* </ClerkProvider> */}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
