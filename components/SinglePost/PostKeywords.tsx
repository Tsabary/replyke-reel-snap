import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useEntity, useFeed } from "replyke-rn";

function PostKeywords() {
  const { updateKeywordsFilters } = useFeed();
  const { entity } = useEntity();

  const [visibleCount, setVisibleCount] = useState(5);

  if (!entity || entity.keywords.length <= 0) return null;

  const showMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, entity.keywords.length));
  };

  const reset = () => {
    setVisibleCount(5);
  };

  const isShowingAll = visibleCount >= entity.keywords.length;

  return (
    <View className="flex-row flex-wrap gap-2 mt-4">
      {entity.keywords.slice(0, visibleCount).map((keyword, index) => (
        <TouchableOpacity
          onPress={() => updateKeywordsFilters?.("add", "includes", keyword)}
          className="border border-gray-500 px-3 py-1 rounded-lg"
          key={index}
        >
          <Text className="text-gray-500 text-sm">{keyword}</Text>
        </TouchableOpacity>
      ))}
      {entity.keywords.length > 5 && (
        <TouchableOpacity
          onPress={isShowingAll ? reset : showMore}
          className="px-3 py-1 rounded-lg"
        >
          <Text className="text-gray-500 text-sm">
            {isShowingAll ? "Hide" : "Show more"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default PostKeywords;
