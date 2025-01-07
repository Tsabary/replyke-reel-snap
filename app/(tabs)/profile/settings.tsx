import { Pressable, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Redirect, useRouter } from "expo-router";
import { useAuth as useAuthReplyke, useUser } from "replyke-rn";
import { showMessage } from "react-native-flash-message";
import { StatusBar } from "expo-status-bar";
// import { useAuth as useAuthClerk } from "@clerk/clerk-expo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

import BackNavigation from "../../../components/shared/BackNavigation";

const Settings = () => {
  const router = useRouter();
  const { loadingInitial, signOut: signOutReplyke } = useAuthReplyke();
  const { user } = useUser();
  // const { signOut: signOutClerk } = useAuthClerk(); // f using clerk, we need to sing out both from replyke and from Clerk (or any other provider)

  if (loadingInitial) return null;
  if (!user) return <Redirect href="/authenticate" />;

  return (
    <>
      <StatusBar style="dark" backgroundColor="#f5f5f4" />
      <SafeAreaView className="flex-1 bg-stone-100">
        <BackNavigation title="Settings" className="pr-4" />

        <View className="p-4">
          <View className="bg-white rounded-xl py-3">
            <Pressable
              onPress={() => {
                router.navigate("/profile/edit-profile");
              }}
              className="flex flex-row items-center gap-4 p-4"
            >
              <AntDesign name="edit" size={22} color="#1f2937" />
              <Text className="text-gray-800 text-lg">Edit Profile</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                // We need to sign out both from Replyke and from our user managment provider, if we use one
                signOutReplyke?.();
                // signOutClerk();
                showMessage({
                  message: "Ciao for Now",
                  description: "Until next time, stay awesome!",
                });
              }}
              className="flex flex-row items-center gap-4 p-4"
            >
              <MaterialIcons name="logout" size={22} color="#1f2937" />
              <Text className="text-gray-800 text-lg">Sign out</Text>
            </Pressable>
          </View>
        </View>
        <View className="flex-1" />
        <Link href="https://replyke.com/">
          <View className="flex flex-row items-center gap-4 p-6 mb-2">
            <AntDesign name="deleteuser" size={22} color="#9ca3af" />
            <Text className="text-gray-400 text-lg">Delete account</Text>
          </View>
        </Link>
      </SafeAreaView>
    </>
  );
};

export default Settings;
