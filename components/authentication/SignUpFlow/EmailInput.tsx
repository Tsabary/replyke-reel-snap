import { View } from "react-native";
import React from "react";
import { isEmail } from "validator";
import { Control, FieldErrors, UseFormSetError } from "react-hook-form";

import CustomTextInput from "../../ui/CustomTextInput";
import CustomButton from "../../ui/CustomButton";

const EmailInput = ({
  email,
  control,
  errors,
  setError,
  setSignUpStage,
}: {
  email: string;
  control: Control<
    {
      email: string;
      password: string;
    },
    any
  >;
  errors: FieldErrors<{
    email: string;
    password: string;
  }>;
  setError: UseFormSetError<{
    email: string;
    password: string;
  }>;
  setSignUpStage: (stage: "email" | "password") => void;
}) => {
  return (
    <View className="gap-3 p-6 pb-3">
      {/* Email Field */}
      <CustomTextInput
        name="email"
        placeholder="Email"
        control={control}
        keyboardType="email-address"
        autoComplete="email"
        error={errors.email?.message}
      />

      {/* Continue Button */}
      <CustomButton
        onPress={() => {
          if (!isEmail(email)) {
            setError("email", {
              type: "invalid",
              message: "Enter a valid email address",
            });
            return;
          }
          setSignUpStage("password");
        }}
        text="Continue"
        disabled={email.length === 0}
      />
    </View>
  );
};

export default EmailInput;
