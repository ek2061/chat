import Page from "@/modules/Page";
import React, { ReactNode } from "react";

interface PageProps {
  children?: ReactNode;
}

const withPageLayout =
  (Component: React.ComponentType<PageProps>) => (props: PageProps) =>
    (
      <Page>
        <Component {...props} />
      </Page>
    );
export default withPageLayout;
