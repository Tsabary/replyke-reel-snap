import React, { useState, forwardRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  TextInputProps,
} from "react-native";
import { Controller } from "react-hook-form";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

import { cn } from "../../utils/cn";

interface CustomPasswordInputProps extends TextInputProps {
  placeholder: string;
  control: any;
  name: string;
  className?: string;
  error?: string;
}

const CustomPasswordInput = forwardRef<TextInput, CustomPasswordInputProps>(
  ({ placeholder, control, name, className, error, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
      <View className={cn("gap-1", className)}>
        <View
          className={cn(
            "rounded-xl bg-gray-100 flex-row justify-between items-center",
            error ? "border-2 border-red-600" : ""
          )}
        >
          <View className="flex-grow">
            <Controller
              control={control}
              rules={{
                minLength: 8,
                required: true,
                validate: (value, formValues) => value === formValues.password,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={ref}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value.trim())}
                  value={value}
                  placeholder={placeholder}
                  placeholderTextColor={"#4b5563"}
                  secureTextEntry={!isPasswordVisible}
                  className="px-6 py-5"
                  {...props}
                />
              )}
              name={name}
            />
          </View>
          <View className="pr-4">
            {!isPasswordVisible ? (
              <TouchableOpacity onPress={() => setIsPasswordVisible(true)}>
                <Feather name="eye-off" size={18} color="#9ca3af" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setIsPasswordVisible(false)}>
                <Feather name="eye" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {error && (
          <View className="flex-row items-center gap-1">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#dc2626"
            />
            <Text className="text-red-600">{error}</Text>
          </View>
        )}
      </View>
    );
  }
);

export default CustomPasswordInput;
