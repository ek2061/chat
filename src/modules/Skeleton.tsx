import { PhotoIcon } from "@heroicons/react/24/solid";
import React from "react";

const Skeleton: React.FC = () => {
  return (
    <div className="flex h-48 w-80 items-center justify-center rounded-md bg-slate-400 align-top">
      <PhotoIcon className="h-12 max-h-80 w-12 max-w-xs" />
    </div>
  );
};

export default Skeleton;
