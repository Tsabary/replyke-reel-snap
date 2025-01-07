import { Text, TextInput, View } from "react-native";
import React, { forwardRef, useState } from "react";
import { isStrongPassword } from "validator";
import { Control, FieldErrors, UseFormSetError } from "react-hook-form";
import AntDesign from "@expo/vector-icons/AntDesign";


import CustomPasswordInput from "../../ui/CustomPasswordInput";
import CustomButton from "../../ui/CustomButton";

interface PasswordInputProps {
  password: string;
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
  isCreating: boolean;
  submitForm: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
}
const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  ({ password, control, errors, setError, isCreating, submitForm }, ref) => {
    // Password validation state
    const [passwordValidations, setPasswordValidations] = useState({
      length: false,
      case: false,
      number: false,
    });

    // Validate password conditions
    const validatePasswordConditions = (password: string) => {
      setPasswordValidations({
        length: password.length >= 8 && password.length <= 20,
        case: /[a-z]/.test(password) && /[A-Z]/.test(password),
        number: /\d/.test(password),
      });
    };

    React.useEffect(() => {
      validatePasswordConditions(password);
    }, [password]);

    const allConditionsMet = Object.values(passwordValidations).every(Boolean);

    return (
      <View className="gap-3 p-6 flex-1">
        {/* Password Field */}
        <CustomPasswordInput
          ref={ref}
          placeholder="Password"
          control={control}
          name="password"
          error={errors.password?.message}
        />
        <View className="m-2 gap-1">
          {[
            {
              condition: passwordValidations.length,
              label: "8 characters (20 max)",
            },
            {
              condition: passwordValidations.case,
              label: "1 uppercase letter and 1 lowercase letter",
            },
            {
              condition: passwordValidations.number,
              label: "1 number",
            },
          ].map(({ condition, label }) => (
            <View className="flex-row items-center gap-2.5" key={label}>
              {condition ? (
                // Blur for fulfilled
                <AntDesign name="checkcircleo" size={18} color="#3b82f6" />
              ) : (
                // Gray for unfulfilled
                <AntDesign name="checkcircleo" size={18} color="#6b7280" />
              )}
              <Text
                className={`text-base ${
                  condition ? "text-blue-500" : "text-gray-500"
                }`}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>

        {/* Continue Button */}
        <CustomButton
          onPress={() => {
            if (!allConditionsMet) {
              setError("password", {
                type: "invalid",
                message: "Password does not meet all requirements",
              });
              return;
            }

            if (
              !isStrongPassword(password, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 0,
              })
            ) {
              setError("password", {
                type: "invalid",
                message: "Invalid password",
              });
              return;
            }

            submitForm();
          }}
          text="Create Account"
          activeText="Creating.."
          submitting={isCreating}
          disabled={!allConditionsMet || isCreating || password.length === 0}
        />
      </View>
    );
  }
);

export default PasswordInput;
