import { ChatContext } from "@/context/ChatContext";
import {
  EllipsisHorizontalIcon,
  UserPlusIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";
import React, { useContext } from "react";

const ChatroomTool: React.FC = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="flex h-12 items-center justify-between bg-chatbar p-2.5 text-gray-200">
      <span>{data.user.displayName}</span>
      <div className="flex gap-2.5">
        <VideoCameraIcon className="h-6 w-6 cursor-pointer" />
        <UserPlusIcon className="h-6 w-6 cursor-pointer" />
        <EllipsisHorizontalIcon className="h-6 w-6 cursor-pointer" />
      </div>
    </div>
  );
};

export default ChatroomTool;
