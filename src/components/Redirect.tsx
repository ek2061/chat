import { AuthContext } from "@/context/AuthContext";
import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { currentUser, isLoading } = useContext(AuthContext);

  if (isLoading) return <>身分認證中...</>;

  if (!isLoading && !currentUser) return <Navigate to="/login" />;

  return <>{children}</>;
};
