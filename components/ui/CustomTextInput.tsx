import React from "react";
import { View, Text, TextInput } from "react-native";
import { Controller } from "react-hook-form";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cn } from "../../utils/cn";

const CustomTextInput = ({
  name,
  placeholder,
  control,
  keyboardType = "default",
  autoComplete = "off",
  error,
  className,
}: {
  name: string;
  placeholder: string;
  control: any;
  keyboardType?: "default" | "email-address";
  autoComplete?: "off" | "email";
  error?: string;
  className?: string;
}) => {
  return (
    <View className={cn("gap-2", className)}>
      <View
        className={cn(
          "rounded-xl bg-gray-100",
          error ? "border-2 border-red-600" : ""
        )}
      >
        <Controller
          control={control}
          rules={{
            maxLength: 80,
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              placeholder={placeholder}
              placeholderTextColor={"#4b5563"}
              keyboardType={keyboardType}
              autoComplete={autoComplete}
              className="px-6 py-5"
            />
          )}
          name={name}
        />
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
};

export default CustomTextInput;
