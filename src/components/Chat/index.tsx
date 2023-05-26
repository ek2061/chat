import { useAppSelector } from "@/hooks/useRedux";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import React from "react";
import Chatbar from "./Chatbar";
import Input from "./Input";
import Messages from "./Messages";

const Chat: React.FC = () => {
  const { chatData } = useAppSelector((state) => state.user);

  if (!chatData.user.uid)
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center bg-gray-200 text-sidebar">
        <ChatBubbleLeftRightIcon className="w-4/5 max-w-[90px]" />
        <p className="text-center text-2xl font-semibold max-md:text-xl">
          Find or select your friends and start chatting!
        </p>
      </div>
    );

  return (
    <div className="flex w-3/4 flex-1 flex-col sm:w-2/3">
      <Chatbar />
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
