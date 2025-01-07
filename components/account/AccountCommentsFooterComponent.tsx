import { View, ActivityIndicator } from "react-native";

const AccountCommentsFooterComponent = ({
  hasMore,
  loading,
}: {
  hasMore: boolean;
  loading: boolean;
}) => {
  return (
    hasMore &&
    loading && (
      <View
        style={{
          padding: 12,
          justifyContent: "center", // Center vertically
          alignItems: "center", // Center horizontally
        }}
      >
        <ActivityIndicator />
      </View>
    )
  );
};

export default AccountCommentsFooterComponent;
