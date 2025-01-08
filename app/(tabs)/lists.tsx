import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListsProvider, useAuth, useLists, useUser } from "replyke-rn";
import { FlatList, Pressable, Text, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { StatusBar } from "expo-status-bar";
import { Redirect } from "expo-router";

import BackNavigation from "../../components/shared/BackNavigation";
import SingleBookmark from "../../components/lists/SingleBookmark";
import { BookmarkSkeleton } from "../../components/shared/Skeleton";

function Bookmarks() {
  const { currentList, subLists, openList, goBack } = useLists();
  const [listHeight, setListHeight] = useState(0);

  return (
    <>
      <StatusBar style="dark" backgroundColor="#fff" />
      <SafeAreaView className="flex-1 bg-white">
        <BackNavigation
          title={currentList?.parentId ? currentList.name : "Collections"}
          onPress={currentList?.parentId ? goBack : undefined}
        />
        <View
          className="flex-1"
          onLayout={(event) => setListHeight(event.nativeEvent.layout.height)}
        >
          {currentList ? (
            <FlatList
              data={currentList?.entities}
              keyExtractor={(item) => item.id!}
              renderItem={({ item: entity }) => (
                <SingleBookmark entity={entity} />
              )}
              ListEmptyComponent={
                <View
                  className="flex-1"
                  style={{
                    backgroundColor: "white",
                    justifyContent: "center",
                    height: listHeight,
                  }}
                >
                  <Text className="text-center text-xl font-medium text-gray-400">
                    Oops, No bookmarks Yet
                  </Text>
                  <Text className="text-center text-lg text-gray-400 mt-2">
                    Start saving your favorites to find them here easily anytime
                  </Text>
                </View>
              }
            />
          ) : (
            <FlatList
              data={[1, 2]}
              keyExtractor={(item) => item.toString()}
              renderItem={() => <BookmarkSkeleton />}
            />
          )}
        </View>
        {(subLists?.length || 0) > 0 && (
          <View className="mt-5">
            <Text className="text-xl text-gray-100 px-5 py-5 border-t border-b border-gray-800">
              Sub Lists
            </Text>
            <View className="mt-4">
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
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

export default () => {
  const { loadingInitial } = useAuth();
  const { user } = useUser();

  if (loadingInitial) return null;
  if (!user) return <Redirect href="/authenticate" />;

  return (
    <ListsProvider>
      <Bookmarks />
    </ListsProvider>
  );
};
