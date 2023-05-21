import { AuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";
import { db } from "@/firebase";
import { doc, getDoc, onSnapshot, Timestamp } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

interface ChatsData {
  [key: string]: {
    date: Timestamp;
    lastMessage: string;
    sender: string;
    userInfo: {
      photoURL: string;
      email: string;
      uid: string;
      displayName: string;
    };
  };
}

const UserChats: React.FC = () => {
  const [chats, setChats] = useState<ChatsData>({});

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = async () => {
      if (!currentUser?.uid) return;

      const userChatsSnapshot = await getDoc(
        doc(db, "userChats", currentUser.uid)
      );

      if (userChatsSnapshot.exists()) {
        const userChatsData = userChatsSnapshot.data();

        const chatsWithUserData = await Promise.all(
          Object.entries(userChatsData).map(async ([chatId, chatData]) => {
            const userInfoRef = chatData.userInfo;
            const userInfoSnapshot = await getDoc(userInfoRef);

            if (userInfoSnapshot.exists()) {
              const userInfoData = userInfoSnapshot.data();
              chatData.userInfo = userInfoData;
            }

            return [chatId, chatData];
          })
        );

        const sortedChats = Object.fromEntries(
          chatsWithUserData.sort(
            (a, b) => b[1].date?.seconds - a[1].date?.seconds
          )
        );

        setChats(sortedChats);
      }
    };

    if (currentUser?.uid) {
      getChats().catch((error) => {
        console.error("Error getting chats:", error);
      });

      const unsubscribe = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        () => {
          getChats().catch((error) => {
            console.error("Error getting chats:", error);
          });
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [currentUser?.uid]);

  const handleSelect = (u: ChatsData["key"]["userInfo"]) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  useEffect(() => {
    if (Object.keys(chats).length > 0) {
      const firstChatId = Object.keys(chats)[0];
      const firstChat = chats[firstChatId];

      // if sender is you, don't send a notification
      if (!firstChat.sender || firstChat.sender === "you") return;

      const fiveSecondsAgo = new Date(Date.now() - 5000);

      if (firstChat.date?.seconds * 1000 > fiveSecondsAgo.getTime()) {
        new Notification(`message from ${firstChat.sender}`, {
          body: firstChat.lastMessage,
          icon: firstChat.userInfo.photoURL,
        });
      }
    }
  }, [chats, currentUser?.uid]);

  return (
    <div>
      <p className="px-3 py-2 text-lg text-white">
        your friends ({Object.keys(chats).length})
      </p>
      {chats &&
        Object.entries(chats)
          .sort((a, b) => b[1].date?.seconds - a[1].date?.seconds)
          .map((c) => (
            <div
              className="flex cursor-pointer items-center gap-2.5 p-2.5 text-white hover:bg-navbar"
              key={c[0]}
              onClick={() => handleSelect(c[1].userInfo)}
            >
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={c[1].userInfo.photoURL}
                alt={c[1].userInfo.displayName}
              />
              <div className="flex flex-grow flex-col overflow-hidden">
                <span className="text-lg font-medium">
                  {c[1].userInfo.displayName}
                </span>
                {c[1].sender && (
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-300">
                    {`${c[1].sender}: ${c[1].lastMessage}`}
                  </p>
                )}
              </div>
            </div>
          ))}
    </div>
  );
};

export default UserChats;
