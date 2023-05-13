import { ChatContext } from "@/context/ChatContext";
import { db } from "@/firebase";
import { Timestamp, doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import Message from "./Message";

interface messagesData {
  date: Timestamp;
  id: string;
  senderId: string;
  text: string;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<messagesData[]>([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unsubscribe();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages && messages.map((m) => <Message message={m} key={m.id} />)}
    </div>
  );
};

export default Messages;
