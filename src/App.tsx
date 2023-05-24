import "nprogress/nprogress.css";
import React from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FallbackProvider } from "./context/FallbackContext";
import { routes } from "./routes";

const App: React.FC = () => {
  const content = useRoutes(routes);

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
