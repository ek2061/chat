import { db } from "@/firebase";
import { useAppSelector } from "@/hooks/useRedux";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";

interface messagesData {
  date: Timestamp;
  id: string;
  senderId: string;
  text: string;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<messagesData[]>([]);
  const { chatData } = useAppSelector((state) => state.user);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chatData.chatId) return;

    const unsubscribe = onSnapshot(
      query(
        collection(db, "chats", chatData.chatId, "messages"),
        orderBy("date", "desc")
        // limit(10)
      ),
      (snapshot) => {
        const m: messagesData[] = [];
        snapshot.forEach((doc) => {
          m.push(doc.data() as messagesData);
        });
        setMessages(m.reverse());
      }
    );

    return () => {
      unsubscribe();
    };
  }, [chatData.chatId]);

  const scrollEnd = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    scrollEnd();
  }, [messages]);

  return (
    <div className="h-[calc(100vh-160px)] w-full overflow-y-auto bg-gray-200 p-2.5">
      {messages &&
        messages.map((m) => (
          <Message key={m.id} message={m} scrollEnd={scrollEnd} />
        ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
