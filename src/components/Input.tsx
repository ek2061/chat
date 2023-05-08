import { PaperClipIcon, PhotoIcon } from "@heroicons/react/24/outline";
import React from "react";

const Input: React.FC = () => {
  return (
    <div className="input">
      <input type="text" placeholder="Type something..." />

      <div className="send">
        <PaperClipIcon className="h-6 cursor-pointer" />
        <input type="file" className="hidden" id="file" />
        <label htmlFor="file" className="flex items-center">
          <PhotoIcon className="h-6 cursor-pointer" />
        </label>
        <button>Send</button>
      </div>
    </div>
  );
};

export default Input;
