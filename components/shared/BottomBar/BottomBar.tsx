import React from "react";
import { View } from "react-native";
import HomeButton from "./HomeButton";
import ListsButton from "./ListsButton";
import NotificationsButton from "./NotificationsButton";
import ProfileButton from "./ProfileButton";
import CreateButton from "./CreateButton";

export default function BottomBar({ state, descriptors, navigation }: any) {
  const homeRoute = state.routes.find((route: any) => route.name === "index");
  const listsRoute = state.routes.find((route: any) => route.name === "lists");
  const notificationsRoute = state.routes.find(
    (route: any) => route.name === "notifications"
  );
  const profileRoute = state.routes.find(
    (route: any) => route.name === "profile"
  );

  const getLabel = (route: any) => {
    const { options } = descriptors[route.key];
    return options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name;
  };

  const isFocused = (routeName: string) => {
    return routeName === state.routes[state.index]?.name;
  };

  const navigateToTab = (routeName: string, routeKey: string) => {
    const event = navigation.emit({
      type: "tabPress",
      target: routeKey,
      canPreventDefault: true,
    });

    if (!isFocused(routeName) && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  return (
    <View className="flex-row items-center justify-evenly bg-black pt-2 pb-1">
      {/* Home Button */}
      {homeRoute && (
        <View key={homeRoute.key}>
          <HomeButton
            isFocused={isFocused(homeRoute.name)}
            label={getLabel(homeRoute)}
            navigateToTab={() => navigateToTab(homeRoute.name, homeRoute.key)}
          />
        </View>
      )}

      {/* Lists Button */}
      {listsRoute && (
        <View key={listsRoute.key}>
          <ListsButton
            isFocused={isFocused(listsRoute.name)}
            label={getLabel(listsRoute)}
            navigateToTab={() => navigateToTab(listsRoute.name, listsRoute.key)}
          />
        </View>
      )}

      {/* Create Button */}
      <View key="create-button">
        <CreateButton />
      </View>

      {/* Notifications Button */}
      {notificationsRoute && (
        <View key={notificationsRoute.key}>
          <NotificationsButton
            isFocused={isFocused(notificationsRoute.name)}
            label={getLabel(notificationsRoute)}
            navigateToTab={() =>
              navigateToTab(notificationsRoute.name, notificationsRoute.key)
            }
          />
        </View>
      )}

      {/* Profile Button */}
      {profileRoute && (
        <View key={profileRoute.key}>
          <ProfileButton
            isFocused={isFocused(profileRoute.name)}
            label={getLabel(profileRoute)}
            navigateToTab={() =>
              navigateToTab(profileRoute.name, profileRoute.key)
            }
          />
        </View>
      )}
    </View>
  );
}
