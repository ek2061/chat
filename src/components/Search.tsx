import UserImage from "@/assets/user.png";
import { db } from "@/firebase";
import { useAppSelector } from "@/hooks/useRedux";
import { PlusIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

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

  const { authData } = useAppSelector((state) => state.user);

  const { t } = useTranslation();

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
    if (e.key === "Enter") {
      e.currentTarget.value = "";
      handleSearch();
    }
  };

  const handleSelect = async (u: UserData) => {
    // check whether the group (chats in firestore) exists, if not create
    if (authData.currentUser && user) {
      const combinedId =
        authData.currentUser.uid > u.uid
          ? authData.currentUser.uid + u.uid
          : u.uid + authData.currentUser.uid;

      try {
        const res = await getDocs(
          collection(db, "chats", combinedId, "messages")
        );

        if (res.empty) {
          //create a chat in chats collection
          await addDoc(collection(db, "chats", combinedId, "messages"), {});

          // create user chats
          await setDoc(
            doc(db, "userChats", authData.currentUser.uid),
            {
              [combinedId]: {
                userInfo: doc(db, "users", u.uid),
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
                userInfo: doc(db, "users", authData.currentUser.uid),
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
    <div className="relative border-0 border-b-2 border-solid text-gray-500">
      <div className="flex items-center space-x-2 p-2.5">
        <input
          className="border-none bg-transparent text-white outline-none placeholder:text-base placeholder:text-gray-400 max-sm:w-32"
          type="text"
          placeholder={t("findUsers") as string}
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
        />
        <MagnifyingGlassIcon
          className="absolute right-5 h-6 w-6 cursor-pointer rounded-md p-0.5 text-gray-200 hover:bg-blue-400"
          onClick={handleSearch}
        />
      </div>
      {error && (
        <span className="px-2 text-sm text-gray-400 opacity-50">{error}</span>
      )}

      {user.length > 0 && (
        <div>
          <div className="flex items-center justify-between pr-6">
            <p className="px-3">{t("findUsersRes", { count: user.length })}</p>
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
