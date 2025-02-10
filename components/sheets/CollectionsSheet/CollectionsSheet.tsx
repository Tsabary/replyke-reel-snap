import React, { useCallback, useMemo, useState } from "react";
import { Platform, KeyboardAvoidingView, Keyboard } from "react-native";
import { useLists } from "@replyke/expo";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import useSheetManager from "../../../hooks/useSheetManager";
import SheetHeader from "./CollectionsSheetHeader";
import CurrentCollectionItems from "./CurrentCollectionItems";
import CreateNewCollection from "./CreateNewCollection";
import SubCollections from "./SubCollections";

const CollectionsSheet = () => {
  const { goToRoot } = useLists();
  const { saveToListSheetRef, setCollectionsEntityId } = useSheetManager();
  const [isCreateCollectionView, setIsCreateCollectionView] = useState(false);
  const [newListName, setNewListName] = useState("");

  const snapPoints = useMemo(() => ["50%"], []);

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
    <BottomSheet
      ref={saveToListSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onChange={(state) => {
        if (state === -1) {
          setCollectionsEntityId?.(null);
          Keyboard.dismiss();
          goToRoot?.();
        }
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <BottomSheetView className="h-full">
          <SheetHeader
            newListName={newListName}
            setNewListName={setNewListName}
            isCreateListView={isCreateCollectionView}
            setIsCreateListView={setIsCreateCollectionView}
          />

          <CurrentCollectionItems />

          <CreateNewCollection
            newListName={newListName}
            setNewListName={setNewListName}
            isCreateCollectionView={isCreateCollectionView}
            setIsCreateCollectionView={setIsCreateCollectionView}
          />
          <SubCollections />
        </BottomSheetView>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

export default CollectionsSheet;
