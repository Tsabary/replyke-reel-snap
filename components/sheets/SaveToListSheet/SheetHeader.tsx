import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { handleError, useLists } from "replyke-rn";
import { cn } from "../../../utils/cn";

const styles = {
  button: "py-2 px-4 bg-gray-300 rounded-xl",
  buttonActive: "py-2 px-4 bg-blue-500 rounded-xl",
  textCancel: "text-left text-lg font-medium text-gray-500",
  textAction: "text-right text-lg font-medium",
  headerText: "flex-1 text-xl font-medium text-center text-stone-700",
  container: "flex-row py-4 px-4 items-center gap-2",
};

const SheetHeader = ({
  entityId,
  isCreateListView,
  setIsCreateListView,
  newListName,
  setNewListName,
}: {
  entityId: string | null | undefined;
  isCreateListView: boolean;
  setIsCreateListView: React.Dispatch<React.SetStateAction<boolean>>;
  newListName: string;
  setNewListName: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const {
    currentList,
    isEntityInList,
    goBack,
    addToList,
    removeFromList,
    createList,
    updateList,
  } = useLists();

  const [isEditingName, setIsEditingName] = useState(false);
  const [updatedListName, setUpdatedListName] = useState("");

  useEffect(() => {
    if (!currentList) return;
    setUpdatedListName(currentList.name);
  }, [currentList]);

  const handleCreateList = async (): Promise<void> => {
    try {
      setNewListName("");
      setIsCreateListView(false);
      if (newListName.length > 2) {
        await createList?.({ listName: newListName });
      }
    } catch (err) {
      handleError(err, "Failed to create list: ");
    }
  };

  const renderLeftButton = () => {
    if (isCreateListView) {
      return (
        <TouchableOpacity
          onPress={() => setIsCreateListView(false)}
          className={styles.button}
        >
          <Text className={styles.textCancel}>Cancel</Text>
        </TouchableOpacity>
      );
    }

    if (currentList?.parentId) {
      return (
        <TouchableOpacity onPress={() => goBack?.()} className={styles.button}>
          <Text className={styles.textCancel}>Back</Text>
        </TouchableOpacity>
      );
    }

    return <View className="w-1/4" />;
  };

  const renderRightButton = () => {
    if (isCreateListView) {
      return (
        <TouchableOpacity
          onPress={handleCreateList}
          className={
            newListName.length > 2 ? styles.buttonActive : styles.button
          }
        >
          <Text
            className={cn(
              styles.textAction,
              newListName.length > 2 ? "text-white" : "text-gray-500"
            )}
          >
            Create
          </Text>
        </TouchableOpacity>
      );
    }

    if (entityId && isEntityInList?.(entityId)) {
      return (
        <TouchableOpacity
          onPress={() => removeFromList?.({ entityId })}
          className={cn(styles.button, "bg-transparent")}
        >
          <Text className={cn(styles.textAction, "text-red-300")}>Remove</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => entityId && addToList?.({ entityId })}
        className={styles.buttonActive}
      >
        <Text className={cn(styles.textAction, "text-white")}>Save</Text>
      </TouchableOpacity>
    );
  };

  if (isEditingName) {
    return (
      <View className={styles.container}>
        <TextInput
          value={updatedListName}
          onChangeText={setUpdatedListName}
          placeholder="Change List Name"
          placeholderTextColor="#9ca3af"
          className="border border-gray-400 rounded-2xl py-2.5 px-4 text-gray-100 flex-1"
          numberOfLines={1}
          multiline={false}
          style={{ lineHeight: 24 }}
        />
        <TouchableOpacity
          onPress={() => {
            setIsEditingName(false);
            setUpdatedListName(currentList?.name || "");
          }}
          className={styles.button}
        >
          <Text className={styles.textCancel}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (updatedListName.length <= 2) return;
            if (!entityId) return;
            if (!currentList) return;
            updateList?.({
              listId: currentList.id,
              update: { name: updatedListName },
            });
            setIsEditingName(false);
          }}
          className={styles.button}
        >
          <Text
            className={cn(
              styles.textAction,
              updatedListName.length > 2 ? "text-blue-400" : "text-gray-500"
            )}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className="w-1/4 items-start">{renderLeftButton()}</View>
      <Text
        className={styles.headerText}
        onLongPress={() => {
          if (currentList?.parentId) setIsEditingName(true);
        }}
      >
        {isCreateListView
          ? "Create a Collection"
          : currentList?.parentId
          ? currentList.name
          : "Collections"}
      </Text>
      <View className="w-1/4 items-end">{renderRightButton()}</View>
    </View>
  );
};

export default SheetHeader;
