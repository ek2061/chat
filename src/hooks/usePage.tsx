import { FallbackContext, FallbackType } from "@/context/FallbackContext";
import { useCallback, useContext } from "react";

export const usePage = () => {
  const { updateFallback } = useContext(FallbackContext);

  const onLoad = useCallback(
    (component: FallbackType | undefined) => {
      if (component === undefined) component = null;
      updateFallback(component);
    },
    [updateFallback]
  );

  return { onLoad };
};
