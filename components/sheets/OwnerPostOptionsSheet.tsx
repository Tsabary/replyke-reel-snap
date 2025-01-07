import React, { useCallback, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useFeed } from "replyke-rn";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import useSheetManager from "../../hooks/useSheetManager";
import BottomSheetWrapper from "./BottomSheetWrapper";

const OwnerPostOptionsSheet = () => {
  const { deleteEntity } = useFeed();
  const {
    ownerPostOptionsSheetRef,
    optionsEntity,
    setOptionsEntity,
    closeOwnerPostOptionsSheet,
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
        ref={ownerPostOptionsSheetRef}
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
              closeOwnerPostOptionsSheet?.();
              deleteEntity?.({ entityId: optionsEntity!.id });
            }}
            className="flex-row items-center gap-4 p-3"
          >
            <FontAwesome6 name="trash" size={24} color="#6b7280" />
            <Text className="text-lg flex-1 text-gray-500">Delete</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </BottomSheetWrapper>
  );
};

export default OwnerPostOptionsSheet;
