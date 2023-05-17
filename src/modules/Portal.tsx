import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface PortalProps {
  children: ReactNode | false;
  customRootId?: string;
}

const Portal: React.FC<PortalProps> = ({ children, customRootId }) => {
  const rootId = customRootId || "portal-root";

  let portalRoot = document.getElementById(rootId);

  if (!portalRoot) {
    const divDOM = document.createElement("div");
    divDOM.id = rootId;
    document.body.appendChild(divDOM);
    portalRoot = divDOM;
  }

  return ReactDOM.createPortal(children, portalRoot);
};

export default Portal;
