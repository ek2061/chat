import { ChatContext } from "@/context/ChatContext";
import {
  EllipsisHorizontalIcon,
  UserPlusIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";
import React, { useContext } from "react";
import Input from "./Input";
import Messages from "./Messages";

const Chat: React.FC = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user.displayName}</span>
        <div className="chatIcons">
          <VideoCameraIcon className="h-6 w-6 cursor-pointer" />
          <UserPlusIcon className="h-6 w-6 cursor-pointer" />
          <EllipsisHorizontalIcon className="h-6 w-6 cursor-pointer" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
