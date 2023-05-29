import { onAuthStateChanged, User } from "firebase/auth";
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
import { setWindowWidth } from "./store/app.slice";
import { setCurrentUser, setLoading } from "./store/user.slice";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const content = useRoutes(routes);

  useEffect(() => {
    dispatch(setLoading);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(setCurrentUser({ uid, email, displayName, photoURL } as User));
      } else {
        dispatch(setCurrentUser(null));
      }
    });

    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      dispatch(setWindowWidth(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
