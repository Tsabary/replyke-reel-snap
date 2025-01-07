import React, { useState } from "react";
import { Keyboard, View } from "react-native";
import { useForm } from "react-hook-form";
import { useSignIn } from "@clerk/clerk-expo";

import CustomTextInput from "../ui/CustomTextInput";
import CustomPasswordInput from "../ui/CustomPasswordInput";
import CustomButton from "../ui/CustomButton";
import { OAuthProviders } from "./OAuthProviders";

const LoginFlow = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isLoaded, signIn, setActive } = useSignIn();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: { email: string; password: string }) => {
    if (!isLoaded || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { email, password } = data;

      // Initiate the sign-in process
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      // Check the sign-in status
      if (signInAttempt.status === "complete") {
        // Set the active session and close the authentication sheet
        await setActive({ session: signInAttempt.createdSessionId });
        Keyboard.dismiss();
      } else {
        // Handle incomplete sign-in scenarios (e.g., MFA required)
        console.error(JSON.stringify(signInAttempt, null, 2));
      }

      reset();
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-3 p-6">
      {/* Email Field */}
      <CustomTextInput
        name="email"
        placeholder="Email"
        control={control}
        keyboardType="email-address"
        autoComplete="email"
        error={errors.email?.type === "required" ? "Required field" : undefined}
      />
      {/* Password Field */}
      <CustomPasswordInput
        placeholder="Password"
        control={control}
        name="password"
        error={
          errors.password?.type === "required"
            ? "Required field"
            : errors.password?.type === "minLength"
            ? "Password too short"
            : undefined
        }
      />

      {/* Login Button */}
      <CustomButton
        onPress={handleSubmit(onSubmit)}
        text="Login"
        activeText="Logging you in.."
        disabled={isSubmitting}
        submitting={isSubmitting}
      />
      <OAuthProviders />
    </View>
  );
};

export default LoginFlow;
