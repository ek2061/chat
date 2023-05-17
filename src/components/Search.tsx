import UserImage from "@/assets/user.png";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { PlusIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
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

interface UserData {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
}

const Search: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<UserData[]>([]);
  const [error, setError] = useState<string>("");

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    if (!username) return;

    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      setUser([]);
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length === 0) setError("no user found");
      else setError("");

      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserData;
        setUser((user) => [...user, userData]);
      });
    } catch (err) {
      console.log(err);
      setError("An error occurred while searching for users!!");
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async (u: UserData) => {
    // check whether the group (chats in firestore) exists, if not create
    if (currentUser && user) {
      const combinedId =
        currentUser.uid > u.uid
          ? currentUser.uid + u.uid
          : u.uid + currentUser.uid;

      try {
        const res = await getDoc(doc(db, "chats", combinedId));

        if (!res.exists()) {
          //create a chat in chats collection
          await setDoc(doc(db, "chats", combinedId), { messages: [] });

          // create user chats
          await setDoc(
            doc(db, "userChats", currentUser.uid),
            {
              [combinedId]: {
                userInfo: {
                  uid: u.uid,
                  displayName: u.displayName,
                  photoURL: u.photoURL,
                },
                date: serverTimestamp(),
                lastMessage: "",
              },
            },
            { merge: true }
          );

          await setDoc(
            doc(db, "userChats", u.uid),
            {
              [combinedId]: {
                userInfo: {
                  uid: currentUser.uid,
                  displayName: currentUser.displayName,
                  photoURL: currentUser.photoURL,
                },
                date: serverTimestamp(),
                lastMessage: "",
              },
            },
            { merge: true }
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
    setUser([]);
    setUsername("");
  };

  return (
    <div className="border-0 border-b-2 border-solid text-gray-500">
      <div className="flex items-center space-x-2 p-2.5">
        <MagnifyingGlassIcon className="h-4 w-4 text-gray-200" />
        <input
          className="border-none bg-transparent text-white outline-none placeholder:text-base placeholder:text-gray-400"
          type="text"
          placeholder="find a user by Enter"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      {error && (
        <span className="px-2 text-sm text-gray-400 opacity-50">{error}</span>
      )}

      {user.length > 0 && (
        <div>
          <div className="flex items-center justify-between pr-6">
            <p className="px-3">found {user.length} users</p>
            <XMarkIcon
              className="h-5 w-5 text-white hover:text-gray-400"
              onClick={() => setUser([])}
            />
          </div>
          {user.map((u) => (
            <div
              className="flex cursor-pointer items-center gap-2.5 p-2.5 text-white hover:bg-navbar"
              key={u.uid}
            >
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={u?.photoURL ?? UserImage}
                alt="user-image"
              />
              <div className="flex w-full items-center justify-between px-2">
                <span className="text-lg font-medium">{u?.displayName}</span>
                <PlusIcon
                  className="h-8 w-8 rounded-md p-1 hover:bg-gray-500"
                  onClick={() => handleSelect(u)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
