import { onAuthStateChanged } from "firebase/auth";
import "nprogress/nprogress.css";
import React, { useEffect } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FallbackProvider } from "./context/FallbackContext";
import { auth } from "./firebase";
import { useAppDispatch } from "./hooks/useRedux";
import { routes } from "./routes";
import { setCurrentUser, setLoading } from "./store/auth.slice";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const content = useRoutes(routes);

  useEffect(() => {
    dispatch(setLoading);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setCurrentUser(user));
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <FallbackProvider>
      <SkeletonTheme baseColor="#ebebeb" highlightColor="#bababa">
        {content}
      </SkeletonTheme>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
      />
    </FallbackProvider>
  );
};

export default App;
