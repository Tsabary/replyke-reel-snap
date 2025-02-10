import React from "react";
import { FlatList, View } from "react-native";
import { useLists } from "@replyke/expo";
import { Skeleton } from "@replyke/ui-core-react-native";
import SingleBookmark from "../../lists/SingleBookmark";

function CurrentCollectionItems() {
  const { currentList } = useLists();
  return (
    <View>
      {currentList ? (
        <FlatList
          data={currentList?.entities}
          keyExtractor={(item) => item.id!}
          renderItem={({ item: entity }) => <SingleBookmark entity={entity} />}
        />
      ) : (
        <FlatList
          data={[1, 2]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => (
            <Skeleton
              style={{
                height: 36,
                width: 36,
                borderRadius: 20,
                backgroundColor: "#d1d5db",
              }}
            />
          )}
        />
      )}
    </View>
  );
}

export default CurrentCollectionItems;
