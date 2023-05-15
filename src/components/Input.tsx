import { AuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";
import { db, storage } from "@/firebase";
import { PaperClipIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Input: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<File | null>(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (!currentUser?.uid || !data?.user?.uid) return;

    if (img) {
      const storageRef = ref(storage, uuidv4());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        null,
        (err) => {
          console.log(err);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuidv4(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          });
        }
      );
    } else {
      if (!text) return;

      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuidv4(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    const combinedId =
      currentUser.uid > data.user.uid
        ? currentUser.uid + data.user.uid
        : data.user.uid + currentUser.uid;

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [`${combinedId}.lastMessage`]: img ? "📷" : text,
      [`${combinedId}.date`]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [`${combinedId}.lastMessage`]: img ? "📷" : text,
      [`${combinedId}.date`]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.code === "Enter" && handleSend();
  };

  return (
    <div className="relative">
      {img && (
        <div className="z-100 absolute -top-7 flex h-7 w-full items-center justify-end space-x-3 rounded-sm bg-blue-300 px-2 opacity-80">
          <span className="text-gray-600">{img.name}</span>
          <span className="text-slate-500">{img.size} Bytes</span>
          <XMarkIcon
            className="h-4 w-4 cursor-pointer text-gray-600"
            onClick={() => setImg(null)}
          />
        </div>
      )}

      <div className="flex h-12 items-center justify-between bg-white p-2.5">
        <input
          className="w-full border-none text-lg text-sidebar_hover outline-none placeholder:text-gray-400"
          type="text"
          placeholder="Type something..."
          onChange={(e) => setText(e.target.value)}
          value={text}
          onKeyDown={handleKey}
        />

        <div className="flex items-center gap-2.5">
          <PaperClipIcon className="h-6 cursor-pointer" />
          <input
            type="file"
            accept="image/jpeg, image/png, image/gif"
            className="hidden"
            id="file"
            onChange={(e) => setImg(e.target.files?.[0] || null)}
          />
          <label htmlFor="file" className="flex items-center">
            <PhotoIcon className="h-6 cursor-pointer" />
          </label>
          <button
            className="cursor-pointer rounded-lg border-none bg-blue-400 px-4 py-2.5 text-white hover:bg-blue-500"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;
