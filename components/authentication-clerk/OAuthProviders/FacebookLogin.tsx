import React, { useState } from "react";
import { Text, Pressable, Image } from "react-native";
import { handleError } from "replyke-rn";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

import facebookIcon from "../../../assets/icons/facebook.png";
import { useWarmUpBrowser } from "../useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

const FacebookLogin = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });
  const [authenticating, setAuthenticating] = useState(false);

  const onPress = React.useCallback(async () => {
    if (authenticating) return;
    try {
      setAuthenticating(true);
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/", {
            scheme: "com.myapp",
          }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      handleError(err, "Failed to authenticate with Facebook");
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setAuthenticating(false);
    }
  }, []);

  return (
    <Pressable
      onPress={onPress}
      disabled={authenticating}
      className="border border-gray-300 rounded-xl flex-row items-center px-4 py-2"
    >
      <Image
        source={facebookIcon} // Local PNG
        style={{ height: 36, width: 36 }}
      />

      <Text className="flex-1 text-center font-semibold text-gray-900">
        Continue with Facebook
      </Text>
    </Pressable>
  );
};

export default FacebookLogin;
