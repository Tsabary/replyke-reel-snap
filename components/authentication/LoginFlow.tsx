import React, { useState } from "react";
import { Keyboard, View } from "react-native";
import { useForm } from "react-hook-form";

import CustomTextInput from "../ui/CustomTextInput";
import CustomPasswordInput from "../ui/CustomPasswordInput";
import CustomButton from "../ui/CustomButton";
import { useAuth } from "replyke-rn";
import { useRouter } from "expo-router";

const LoginFlow = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Watch the "username" field
  const email = watch("email");
  const password = watch("password");

  const router = useRouter();
  const { signInWithEmailAndPassword } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: { email: string; password: string }) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { email, password } = data;

      // Initiate the sign-in process
      await signInWithEmailAndPassword?.({
        email,
        password,
      });

      router.back();
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-3 px-6">
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
        activeText="Logging in.."
        disabled={isSubmitting || email.length < 3 || password.length < 3}
        submitting={isSubmitting}
      />
    </View>
  );
};

export default LoginFlow;
