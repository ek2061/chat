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

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser?.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            (message.senderId === currentUser?.uid
              ? currentUser.photoURL
              : data.user.photoURL) as string
          }
          alt=""
        />
        <span className="text-xs text-gray-500">{localDateString}</span>
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
