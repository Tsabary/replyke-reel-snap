import React, { useCallback, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useUser } from "replyke-rn";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { showMessage } from "react-native-flash-message";

import useSheetManager from "../../hooks/useSheetManager";
import BottomSheetWrapper from "./BottomSheetWrapper";

const PostOptionsSheet = () => {
  const { user } = useUser();
  const {
    postOptionsSheetRef,
    optionsEntity,
    setOptionsEntity,
    closePostOptionsSheet,
    setReportedPost,
    openReportPostSheet,
  } = useSheetManager();

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
        ref={postOptionsSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onChange={(state) => {
          setSheetOpen(state > -1);
          if (state === -1) {
            setOptionsEntity?.(null);
          }
        }}
        backgroundStyle={{ backgroundColor: "#fff" }}
        handleComponent={() => (
          <View className="px-8 py-4 flex-row border-b border-gray-200">
            <Text className="uppercase text-gray-500 text-sm">
              Post Options
            </Text>
          </View>
        )}
      >
        <BottomSheetView className="p-4">
          <Pressable
            onPress={() => {
              closePostOptionsSheet?.();

              if (user) {
                openReportPostSheet?.();
                setReportedPost?.(optionsEntity!);
              } else {
                showMessage({
                  message: "Oops! Login Required",
                  description:
                    "Please sign in or create an account to continue.",
                  type: "warning",
                });
              }
            }}
            className="flex-row items-center gap-4 p-3"
          >
            <MaterialIcons name="flag" size={24} color="#6b7280" />
            <Text className="text-lg flex-1 text-gray-500">Report</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </BottomSheetWrapper>
  );
};

export default PostOptionsSheet;
