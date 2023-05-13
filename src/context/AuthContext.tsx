import { auth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextProps {
  currentUser: User | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  isLoading: true,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
