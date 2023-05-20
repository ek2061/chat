import { AuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";
import Code from "@/modules/Code";
import MessageBox from "@/modules/MessageBox";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import React, { useContext, useEffect, useRef } from "react";

interface messagesData {
  date: Timestamp;
  id: string;
  senderId: string;
  text: string;
  lang?: string;
  img?: string;
}

const Message: React.FC<{ message: messagesData }> = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const date = new Date(message.date.seconds * 1000);
  const localDateString = format(date, "MM/dd HH:mm");

  const isMyMessage = message.senderId === currentUser?.uid;

  return (
    <div
      ref={ref}
      className={`mb-5 flex gap-5 ${isMyMessage && "flex-row-reverse"} w-full`}
    >
      <img
        className="h-10 w-10 rounded-full object-cover"
        aria-label="message-avatar"
        src={
          (isMyMessage ? currentUser.photoURL : data.user.photoURL) as string
        }
        alt={message.senderId}
      />

      <div
        className={`flex  max-w-[80%] flex-col gap-2.5 ${
          isMyMessage && "items-end"
        }`}
      >
        {message.text && (
          <div className="max-w-full">
            <span className="text-xs text-gray-500">{localDateString}</span>
            <MessageBox isMyMessage={isMyMessage}>
              {message.lang ? (
                <Code lang={message.lang} code={message.text} />
              ) : (
                <p aria-label="message-text">{message.text}</p>
              )}
            </MessageBox>
          </div>
        )}
        {message.img && (
          <img
            className="w-1/2 rounded-lg"
            aria-label="message-image"
            src={message.img}
            alt={message.img}
          />
        )}
      </div>
    </div>
  );
};

export default Message;
