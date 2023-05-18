import React, { ReactNode } from "react";

interface ContainerProps {
  isMyMessage: boolean;
  children: ReactNode;
}

const MessageBox: React.FC<ContainerProps> = ({ isMyMessage, children }) => {
  return (
    <div
      className={`max-w-full rounded-lg px-5 py-2.5 ${
        isMyMessage ? "rounded-br-none bg-blue-200" : "rounded-bl-none bg-white"
      } break-words`}
    >
      {children}
    </div>
  );
};

export default MessageBox;
