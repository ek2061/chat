import { useAppSelector } from "@/hooks/useRedux";
import {
  EllipsisHorizontalIcon,
  UserPlusIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";
import React from "react";

const Chatbar: React.FC = () => {
  const { chatData } = useAppSelector((state) => state.user);

  return (
    <div className="flex h-12 items-center justify-between bg-chatbar p-2.5 text-gray-200">
      <span>{chatData.user.displayName}</span>
      <div className="flex gap-2.5">
        <VideoCameraIcon className="h-6 w-6 cursor-pointer" />
        <UserPlusIcon className="h-6 w-6 cursor-pointer" />
        <EllipsisHorizontalIcon className="h-6 w-6 cursor-pointer" />
      </div>
    </div>
  );
};

export default Chatbar;
