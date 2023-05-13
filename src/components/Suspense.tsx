import React, { ComponentType } from "react";

const Suspense =
  <P extends Record<string, unknown>>(Component: ComponentType<P>) =>
  (props: P): JSX.Element => {
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Component {...props} />
      </React.Suspense>
    );
  };

export default Suspense;
