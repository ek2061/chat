import { useAppSelector } from "@/hooks/useRedux";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { currentUser, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        身分認證中...
      </div>
    );

  if (!isLoading && !currentUser) return <Navigate to="/login" />;

  return <>{children}</>;
};
