import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import "./style.scss";

const App: React.FC = () => {
  const content = useRoutes(routes);

  return <>{content}</>;
};

export default App;
