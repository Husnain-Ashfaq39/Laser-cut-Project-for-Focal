
// Redux
import { clearUser } from "@/redux/slices/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme/theme-provider";
import { router } from "@/utils/router";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { RootState } from "./redux/store";
import { fetchUserData } from "@/services/auth";



function App() {
  const auth = getAuth();
  const user = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

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
