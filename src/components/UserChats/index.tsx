import { db } from "@/firebase";
import { useAppSelector } from "@/hooks/useRedux";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ChatsData } from "./type";
import { UserItem } from "./UserItem";
import { UserSkeleton } from "./UserSkeleton";

const UserChats: React.FC = () => {
  const [chats, setChats] = useState<ChatsData>({});
  const [loading, setLoading] = useState<boolean>(true);

  const { authData } = useAppSelector((state) => state.user);

  useEffect(() => {
    const getChats = async () => {
      if (!authData.currentUser?.uid) return;

      const userChatsSnapshot = await getDoc(
        doc(db, "userChats", authData.currentUser.uid)
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

    if (authData.currentUser?.uid) {
      getChats().catch((error) => {
        console.error("Error getting chats:", error);
      });

      const unsubscribe = onSnapshot(
        doc(db, "userChats", authData.currentUser.uid),
        () => {
          getChats().catch((error) => {
            console.error("Error getting chats:", error);
          });
          setLoading(false);
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [authData.currentUser?.uid]);

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
  }, [chats, authData.currentUser?.uid]);

  return (
    <>
      <p className="px-3 py-2 text-lg text-white">
        your friends ({Object.keys(chats).length})
      </p>
      <div className="overflow-y-auto">
        {loading && [1, 2, 3].map((n) => <UserSkeleton key={n} />)}
        {chats &&
          Object.entries(chats)
            .sort((a, b) => b[1].date?.seconds - a[1].date?.seconds)
            .map((c) => <UserItem loading={loading} key={c[0]} chat={c[1]} />)}
      </div>
    </>
  );
};

export default UserChats;
