import { FeedProvider, FeedSortByOptions, UserLean } from "replyke-rn";
import Feed from "./Feed";
import EmptyFlatList from "../shared/EmptyFlatList";

export const feedTitles = ["Following", "Trending", "Fresh"];
// Define your feeds
export const FEEDS = (user: UserLean | null | undefined) => [
  {
    component: user ? (
      <FeedProvider followedOnly={true}>
        <Feed
          listEmptyComponent={
            <EmptyFlatList
              text={`You are not following anyone!\n\nGet out there!`}
              bgColor="bg-gray-800"
              textColor="#f5ec00"
              textShadowColor="#e22400"
            />
          }
        />
      </FeedProvider>
    ) : (
      <EmptyFlatList
        text={`You are logged out!\n\nCreate an account and start following some people!`}
        bgColor="bg-blue-600"
        textColor="#f5ec00"
        textShadowColor="#e22400"
      />
    ),
  },
  { providerProps: { sortBy: "hot" as FeedSortByOptions } },
  { providerProps: { sortBy: "new" as FeedSortByOptions } },
];
