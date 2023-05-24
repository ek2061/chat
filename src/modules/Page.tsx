import { usePage } from "@/hooks/usePage";
import { endLoading, startLoading } from "@/utils/nprogress";
import React, { ReactNode, useEffect, useMemo } from "react";

interface PageProps {
  children: ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => {
  const { onLoad } = usePage();

  const render = useMemo(() => {
    return <>{children}</>;
  }, [children]);

  useEffect(() => {
    onLoad(render);
  }, [onLoad, render]);

  useEffect(() => {
    endLoading();
    return () => startLoading();
  }, []);

  return render;
};

export default Page;
