import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Pressable,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useLists } from "replyke-rn";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Entypo from "@expo/vector-icons/Entypo";

import useSheetManager from "../../../hooks/useSheetManager";
import { BookmarkSkeleton } from "../../shared/Skeleton";
import SheetHeader from "./SheetHeader";
import SingleBookmark from "../../lists/SingleBookmark";

const ListsComponents = ({
  entityId,
}: {
  entityId: string | null | undefined;
}) => {
  const { currentList, subLists, loading, openList } = useLists();
  const [isCreateListView, setIsCreateListView] = useState(false);
  const [newListName, setNewListName] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <BottomSheetView className="h-full">
        <SheetHeader
          entityId={entityId}
          newListName={newListName}
          setNewListName={setNewListName}
          isCreateListView={isCreateListView}
          setIsCreateListView={setIsCreateListView}
        />

        <View>
          {currentList ? (
            <FlatList
              data={currentList?.entities}
              keyExtractor={(item) => item.id!}
              renderItem={({ item: entity }) => (
                <SingleBookmark entity={entity} />
              )}
            />
          ) : (
            <FlatList
              data={[1, 2]}
              keyExtractor={(item) => item.toString()}
              renderItem={() => <BookmarkSkeleton />}
            />
          )}
        </View>

        <View className="border-t border-b border-gray-300 p-3 mt-3">
          {isCreateListView ? (
            <TextInput
              value={newListName}
              onChangeText={setNewListName}
              placeholder="Create a collection.."
              placeholderTextColor="#9ca3af"
              className="bg-gray-200 rounded-2xl p-4 text-gray-600"
            />
          ) : (
            <TouchableOpacity onPress={() => setIsCreateListView(true)}>
              <Text className="text-lg font-medium text-blue-500 m-2">
                Create a new collection
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View className="py-5">
          {loading ? (
            <FlatList
              data={[1, 2]}
              keyExtractor={(item) => item.toString()}
              renderItem={() => <BookmarkSkeleton />}
            />
          ) : (
            <FlatList
              data={subLists}
              keyExtractor={(item) => item.id}
              renderItem={({ item: subList }) => (
                <Pressable
                  onPress={() => openList?.(subList)}
                  className="px-4 py-2.5 flex-row gap-3 items-center to-gray-500"
                >
                  <View className="bg-gray-700 p-2 rounded-2xl">
                    <Entypo name="list" size={20} color="#fff" />
                  </View>
                  <Text className="text-gray-300">{subList.name}</Text>
                </Pressable>
              )}
              // ListEmptyComponent={() => (
              //   <Text className="text-gray-500 text-lg px-4 py-2.5">
              //     Create your first List..
              //   </Text>
              // )}
            />
          )}
        </View>
      </BottomSheetView>
    </KeyboardAvoidingView>
  );
};

const SaveToListSheet = () => {
  const { goToRoot } = useLists();
  const { saveToListSheetRef, listsEntityId, setListsEntityId } =
    useSheetManager();
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
          setListsEntityId?.(null);
          Keyboard.dismiss();
          goToRoot?.();
        }
      }}
    >
      <ListsComponents entityId={listsEntityId} />
    </BottomSheet>
  );
};

export default SaveToListSheet;
