import { AuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";
import { db } from "@/firebase";
import { Timestamp, doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

interface chatsData {
  date: Timestamp;
  lastMessage: string;
  userInfo: {
    photoURL: string;
    uid: string;
    displayName: string;
  };
}

const Chats: React.FC = () => {
  const [chats, setChats] = useState<chatsData[]>([]);

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
          setChats(doc.data() as chatsData[]);
        }
      );

      return () => {
        unsubscribe();
      };
    };

    getChats();
  }, [currentUser?.uid]);

  const handleSelect = (u: chatsData["userInfo"]) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {chats &&
        Object.entries(chats)?.map((chats) => (
          <div
            className="userChat"
            key={chats[0]}
            onClick={() => handleSelect(chats[1].userInfo)}
          >
            <img
              src={chats[1].userInfo.photoURL}
              alt={chats[1].userInfo.displayName}
            />
            <div className="userChatInfo">
              <span>{chats[1].userInfo.displayName}</span>
              <p>{chats[1].lastMessage}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
