import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { routes } from "./routes";

const App: React.FC = () => {
  const content = useRoutes(routes);

  return (
    <>
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
    </>
  );
};

export default App;
