import { Tabs } from "expo-router";
import { BottomBar } from "../../components/shared/BottomBar";

export default function TabLayout() {
  return (
    <Tabs
    initialRouteName="index"
      tabBar={(props) => <BottomBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          title: "Lists",
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
