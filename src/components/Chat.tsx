import { ChatContext } from "@/context/ChatContext";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import React, { useContext } from "react";
import ChatroomTool from "./ChatroomTool";
import Input from "./Input";
import Messages from "./Messages";

const Chat: React.FC = () => {
  const { data } = useContext(ChatContext);

  if (!data.user.uid)
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-200 text-sidebar">
        <ChatBubbleLeftRightIcon className="h-1/12 w-1/12" />
        <p className="text-2xl font-semibold">Find or select your friends</p>
        <p className="text-2xl font-semibold">and start chatting!</p>
      </div>
    );

  return (
    <div className="flex flex-1 flex-col">
      <ChatroomTool />
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
