import UserImage from "@/assets/user.png";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useState } from "react";

interface User {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
}

const Search: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length === 0) setError("no user found");
      else setError("");

      querySnapshot.forEach((doc) => {
        setUser(doc.data() as User);
      });
    } catch (err) {
      console.log(err);
      setError("An error occurred while searching for users!!");
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    // check whether the group (chats in firestore) exists, if not create
    if (currentUser && user) {
      const combinedId =
        currentUser.uid > user.uid
          ? currentUser.uid + user.uid
          : user.uid + currentUser.uid;

      try {
        const res = await getDoc(doc(db, "chats", combinedId));

        if (!res.exists()) {
          //create a chat in chats collection
          await setDoc(doc(db, "chats", combinedId), { messages: [] });

          // create user chats
          await setDoc(doc(db, "userChats", currentUser.uid), {
            [combinedId]: {
              userInfo: {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
              },
              date: serverTimestamp(),
              lastMessage: "",
            },
          });

          await setDoc(doc(db, "userChats", user.uid), {
            [combinedId]: {
              userInfo: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
              },
              date: serverTimestamp(),
              lastMessage: "",
            },
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      {error && (
        <span className="px-2 text-sm text-gray-400 opacity-50">{error}</span>
      )}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user?.photoURL ?? UserImage} alt="user-image" />
          <div className="userChatInfo">
            <span>{user?.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
