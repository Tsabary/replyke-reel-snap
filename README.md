
# ReelSnap

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![npm](https://img.shields.io/badge/types-included-blue?style=flat-square)
[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/)

ReelSnap is a modern boilerplate for building social networks inspired by TikTok and Instagram Reels. It comes with fully functional authentication, dynamic feeds, profiles, and a suite of social features. ReelSnap is powered by [**Replyke**](https://replyke.com/), making it the perfect starting point for developers who want to build engaging, community-driven apps without the hassle of backend complexities.

## Stay Updated
Join the 
<a  href="https://discord.gg/REKxnCJzPz" target="_blank">
Discord server
</a>
and follow on
<a  href="https://x.com/replykejs" target="_blank">
X/Twitter
</a>
and
<a  href="https://replyke.bsky.social" target="_blank">
BlueSky
</a>
to be notified about important changes 

----------

## Overview

ReelSnap provides everything you need to build a feature-rich social app with minimal setup. Here's what it includes:

### 1. Authentication Flows

-   Complete authentication flows with support for:
    -   **Replyke Authentication**: Seamlessly integrate Replyke's user management.
    -   **Clerk Authentication**: Alternate authentication option for developers who prefer Clerk.

### 2. Home Page Feeds

-   A TikTok/Instagram Reels-like feed with full-screen snapping posts.
-   The home screen features three side-by-side feeds:
    -   **Following**: Posts from accounts you follow.
    -   **Trending**: Discover hot and trending posts.
    -   **Fresh**: View the latest new posts.

### 3. User Profiles

-   Stylish and modern user profiles featuring:
    -   Name, username, bio, and external links.
    -   A gallery of user posts.

### 4. Likes and Comments

-   Build community engagement with:
    -   **Post Likes**: Includes automatic scoring of posts to enable smart sorting of feeds.
    -   **Modern Comment Section**: Fully functional comment threads with nested replies and comment likes, providing a seamless user experience.

### 5. Mentions

-   Users can tag others in comments, enabling dynamic social interactions.

### 6. Bookmarks

-   Users can save posts into:
    -   Curated lists.
    -   Nested sublists for deeper organization.

### 7. App Notifications

-   Fully automated notifications for:
    -   Likes, comments, replies, mentions, and more.
    -   No configuration required—everything works out of the box.

### 8. Back Office

-   A developer-friendly admin dashboard to:
    -   Manage users (including banning).
    -   Moderate posts and comments by reviewing reports.

### 9. Complete Backend

-   Thanks to **Replyke**, ReelSnap comes with a robust, plug-and-play backend. This project functions perfectly well without a server, making it easy to get started.
-   However, to enhance functionality and security, integrating a custom server can be highly beneficial. Visit the [Replyke documentation](https://docs.replyke.com/) to learn how to set up and extend your server.

----------

## Powered by Replyke

ReelSnap is built on the powerful foundation of **Replyke**.

Replyke empowers developers to:

1.  Implement **Authentication**: Use Replyke's user management for secure and scalable login systems.
2.  Build **Feeds**: Dynamic and customizable feeds with filtering and sorting options.
3.  Enable **Entities**: Create and manage entities like posts, products, or items with upvotes and downvotes.
4.  Add **Comments**: Nested threads with voting, mentions, and replies.
5.  Handle **Notifications**: Auto-generated in-app notifications with no setup needed.
6.  Organize with **Lists**: User-curated collections and sublists.
7.  Manage with a **Dashboard**: Full admin control for users and content moderation.

Learn more about what you can achieve with Replyke at [replyke.com](https://replyke.com/).

----------

## Getting Started

1.  **Clone this repository**  
    Clone the boilerplate to your local machine:
    
    ```bash
    git clone https://github.com/replyke/reel-snap.git cd <your_repository_name>
    ``` 
    
2.  **Create a Replyke account**  
    Head over to [replyke.com](https://dashboard.replyke.com) and create an account.
    
3.  **Set up a new project**  
    After logging into your Replyke account, create a new project.
    
4.  **Copy your Project ID**  
    Once the project is created, you'll be provided with a **Project ID**. Copy this ID.
    
5.  **Set up your `.env` file**  
    In the root of your cloned project, create a `.env` file (if it doesn't exist). Add the following line, replacing `YOUR_PROJECT_ID` with the Project ID you copied earlier:
    
    `EXPO_PUBLIC_REPLYKE_PROJECT_ID=YOUR_PROJECT_ID` 
    
6.  **Customize and build your app**  
    Customize the front end as needed and start building your app!

----------

## Contributing

Contributions are welcome! If you'd like to improve Replyke's ReelSnap repo or fix issues, feel free to open a pull request or submit an issue.

----------

## License

This project is open-source under the MIT license.

----------

## Conclusion

ReelSnap is your gateway to creating a modern, social app with minimal effort. Powered by Replyke, it takes care of the backend complexities so you can focus on delivering the best user experience.