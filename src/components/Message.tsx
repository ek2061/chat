import { AuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import React, { useContext, useEffect, useRef } from "react";

interface messagesData {
  date: Timestamp;
  id: string;
  senderId: string;
  text: string;
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
      className={`mb-5 flex gap-5 ${isMyMessage && "flex-row-reverse"}`}
    >
      <div className="flex flex-col font-light text-gray-500">
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={
            (message.senderId === currentUser?.uid
              ? currentUser.photoURL
              : data.user.photoURL) as string
          }
          alt=""
        />
        <span className="text-xs text-gray-500">{localDateString}</span>
      </div>
      <div
        className={`flex  max-w-[80%] flex-col gap-2.5 ${
          isMyMessage && "items-end"
        }`}
      >
        {message.text && (
          <p
            className={`max-w-max rounded-lg px-5 py-2.5 ${
              isMyMessage
                ? "rounded-br-none bg-blue-200"
                : "rounded-bl-none bg-white"
            }`}
          >
            {message.text}
          </p>
        )}
        {message.img && (
          <img className="w-1/2 rounded-lg" src={message.img} alt="" />
        )}
      </div>
    </div>
  );
};

export default Message;
