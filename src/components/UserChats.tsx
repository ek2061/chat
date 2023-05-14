import { AuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";
import { db } from "@/firebase";
import { Timestamp, doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

interface ChatsData {
  [key: string]: {
    date: Timestamp;
    lastMessage: string;
    userInfo: {
      photoURL: string;
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
    const getChats = () => {
      if (!currentUser?.uid) {
        return;
      }

      const unsubscribe = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (doc) => {
          setChats(doc.data() as ChatsData);
        }
      );

      return () => {
        unsubscribe();
      };
    };

    getChats();
  }, [currentUser?.uid]);

  const handleSelect = (u: ChatsData["key"]["userInfo"]) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

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
              className="flex cursor-pointer items-center gap-2.5 p-2.5 text-white hover:bg-sidebar_hover"
              key={c[0]}
              onClick={() => handleSelect(c[1].userInfo)}
            >
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={c[1].userInfo.photoURL}
                alt={c[1].userInfo.displayName}
              />
              <div>
                <span className="text-lg font-medium">
                  {c[1].userInfo.displayName}
                </span>
                <p className="text-sm text-gray-300">{c[1].lastMessage}</p>
              </div>
            </div>
          ))}
    </div>
  );
};

export default UserChats;
