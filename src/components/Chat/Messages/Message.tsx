import UserImage from "@/assets/user.png";
import { useAppSelector } from "@/hooks/useRedux";
import Code from "@/modules/Code";
import ImageViewer from "@/modules/ImageViewer";
import Skeleton from "@/modules/Skeleton";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import MessageBox from "./MessageBox";

interface messagesData {
  date: Timestamp;
  id: string;
  senderId: string;
  text: string;
  lang?: string;
  img?: string;
}

interface MessageProps {
  message: messagesData;
  scrollEnd: () => void;
}

const Message: React.FC<MessageProps> = ({ message, scrollEnd }) => {
  const { authData, chatData } = useAppSelector((state) => state.user);

  const [imageViewerOpen, setImageViewerOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const date = new Date(message.date.seconds * 1000);
  const localDateString = format(date, "MM/dd HH:mm");

  const isMyMessage = message.senderId === authData.currentUser?.uid;

  return (
    <div
      className={`mb-5 flex gap-5 ${isMyMessage && "flex-row-reverse"} w-full`}
    >
      <img
        className="h-10 w-10 rounded-full object-cover"
        aria-label="message-avatar"
        src={
          (isMyMessage
            ? authData.currentUser?.photoURL ?? UserImage
            : chatData.user.photoURL ?? UserImage) as string
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
          <>
            <span className="text-xs text-gray-500">{localDateString}</span>
            {loading && <Skeleton />}
            <img
              className={`${
                loading && "hidden"
              } w-1/2 cursor-pointer rounded-lg`}
              aria-label="message-image"
              src={message.img}
              alt={message.img}
              onLoad={() => {
                setLoading(false);
                scrollEnd();
              }}
              onClick={() => setImageViewerOpen(true)}
            />
            {imageViewerOpen && (
              <ImageViewer
                src={message.img}
                onClose={() => setImageViewerOpen(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Message;
