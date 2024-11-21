/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider, useNavigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme/theme-provider";
import { router } from "@/utils/router";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { clearUser } from "@/redux/slices/auth-slice";
import { fetchUserData } from "@/services/auth";
import { fetchDocuments } from "./services/db-services";
import {
  AddClient,
  AddCost,
  AddJob,
  FetchClients,
  refreshToken,
  updateStatus,
} from "./services/webflow-services";
import { RootState } from "./redux/store";

function App() {
  const auth = getAuth();
  const dispatch = useDispatch();
  // Function to check token expiration
  const checkTokenExpiration = async () => {
    try {
      // Fetch the token document
      const tokenData: any = await fetchDocuments("Tokens");

      if (tokenData) {
        const { expires_in } = tokenData[0];
        console.log("Token Expire in  secs" + expires_in);

        // Get current time in seconds (Unix Timestamp)
        const currentTime = Math.floor(Date.now() / 1000);

        if (expires_in - currentTime <= 10 * 60) {
          refreshToken(); // Call refreshToken if about to expire
        }
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  useEffect(() => {
    (async () => {
      await checkTokenExpiration();
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        if (!user.emailVerified) {
          dispatch(clearUser());
          return;
        }
        await fetchUserData(user, dispatch);
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [auth, dispatch]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
