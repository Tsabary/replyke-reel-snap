import {
  AppNotificationsProvider,
  ReplykeProvider,
  TokenManager,
} from "replyke-rn";
// import axios from "axios";
// import {
//   useUser as useUserClerk,
//   useAuth as useAuthClerk,
// } from "@clerk/clerk-expo";
import { SheetManagerProvider } from "./SheetManagerContext";

function ContextProvider({ children }: { children: React.ReactNode }) {
  // TODO: Below is an example of how to get a signedToken when usin Clerk. Comment out if using Clerk, or comment out and edit i fusing a different authentication provider. If using Replyke's email + password authentication, leave commented out or remove.

  // const { user: userClerk } = useUserClerk();
  // const { getToken } = useAuthClerk();
  // const [signedToken, setSignedToken] = useState<string | null>(null);

  // useEffect(() => {
  //   const generateJwt = async () => {
  //     try {
  //       const token = await getToken(); // Get the Clerk session token

  //       const path = process.env.EXPO_PUBLIC_SERVER_URL + "/sign-token";
  //       const response = await axios.get(path, {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // Include the token in the Authorization header
  //         },
  //       });

  //       const signedTokenResponse = response.data;
  //       if (signedTokenResponse) setSignedToken(signedTokenResponse);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       throw error; // Re-throw the error for the caller to handle
  //     }
  //   };

  //   if (userClerk) generateJwt();
  // }, [userClerk]);

  return (
    <ReplykeProvider
      projectId={process.env.EXPO_PUBLIC_REPLYKE_PROJECT_ID!}
      signedToken={undefined}
    >
      <TokenManager expoManaged />

      <SheetManagerProvider>{children}</SheetManagerProvider>
    </ReplykeProvider>
  );
}

export default ContextProvider;
