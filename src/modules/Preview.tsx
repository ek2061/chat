import { XCircleIcon } from "@heroicons/react/24/solid";
import React, { Dispatch, SetStateAction } from "react";

interface PreviewProps {
  src: string;
  onClose: () => void | Dispatch<SetStateAction<boolean>>;
}

const Preview: React.FC<PreviewProps> = ({ src, onClose }) => {
  return (
    <div className="relative h-20 w-20">
      <XCircleIcon
        className="absolute -right-2 -top-2 h-5 w-5 cursor-pointer rounded-full bg-slate-300 text-slate-700"
        onClick={onClose}
      />
      <img className="h-20 w-20 rounded-md object-cover" src={src} />
    </div>
  );
};

export default Preview;
