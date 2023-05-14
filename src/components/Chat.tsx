import React from "react";
import ChatroomTool from "./ChatroomTool";
import Input from "./Input";
import Messages from "./Messages";

const Chat: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col">
      <ChatroomTool />
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
