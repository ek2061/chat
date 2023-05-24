import React, {
  createContext,
  ReactNode,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from "react";

export type FallbackType = NonNullable<ReactNode> | null;

export interface FallbackContextType {
  updateFallback: (fallback: FallbackType) => void;
}

export const FallbackContext = createContext<FallbackContextType>({
  updateFallback: () => {
    //
  },
});

export const FallbackProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fallback, setFallback] = useState<FallbackType>(null);

  const updateFallback = useCallback((fallback: FallbackType) => {
    setFallback(() => fallback);
  }, []);

  const renderChildren = useMemo(() => {
    return children;
  }, [children]);

  return (
    <FallbackContext.Provider value={{ updateFallback }}>
      <Suspense fallback={fallback}>{renderChildren}</Suspense>
    </FallbackContext.Provider>
  );
};
