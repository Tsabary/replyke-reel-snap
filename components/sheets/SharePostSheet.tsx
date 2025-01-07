import React, { useCallback, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import useSheetManager from "../../hooks/useSheetManager";
import BottomSheetWrapper from "./BottomSheetWrapper";

const SharePostSheet = () => {
  const { sharePostSheetRef, sharedPost, setSharedPost } = useSheetManager();

  const snapPoints = useMemo(() => ["100%"], []);

  const [sheetOpen, setSheetOpen] = useState(false);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheetWrapper open={sheetOpen}>
      <BottomSheet
        ref={sharePostSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onChange={(state) => {
          setSheetOpen(state > -1);
          if (state === -1) {
            setSharedPost?.(null);
          }
        }}
        backgroundStyle={{ backgroundColor: "#fff" }}
      >
        <BottomSheetView className="p-6">
          <View className="gap-2">
            <Text className="text-gray-500 text-sm">Copy link</Text>
            <View className="flex-row gap-4 items-stretch">
              <View className="flex-1 bg-gray-200 p-4 pr-0 rounded-xl">
                <Text className="text-gray-600 text-ellipsis">
                  https://briefly.com/{sharedPost?.shortId}
                </Text>
              </View>
              <Pressable className=" bg-gray-200 rounded-xl aspect-square items-center justify-center">
                <MaterialIcons name="content-copy" size={18} color="black" />
              </Pressable>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </BottomSheetWrapper>
  );
};

export default SharePostSheet;
