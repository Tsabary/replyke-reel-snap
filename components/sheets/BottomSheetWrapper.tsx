import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "../../utils/cn";

const BottomSheetWrapper = ({
  children,
  open,
}: {
  children?: React.ReactNode;
  open: boolean;
}) => {
  return (
    <SafeAreaView
      className={cn(
        "flex-1 absolute inset-0",
        open ? "" : "pointer-events-none"
      )}
    >
      <View className="flex-1 relative">{children}</View>
    </SafeAreaView>
  );
};

export default BottomSheetWrapper;
