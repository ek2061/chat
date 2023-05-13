import { AuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";
import { db, storage } from "@/firebase";
import { PaperClipIcon, PhotoIcon } from "@heroicons/react/24/outline";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
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
      [`${combinedId}.lastMessage`]: text,
      [`${combinedId}.date`]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [`${combinedId}.lastMessage`]: text,
      [`${combinedId}.date`]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />

      <div className="send">
        <PaperClipIcon className="h-6 cursor-pointer" />
        <input
          type="file"
          className="hidden"
          id="file"
          onChange={(e) => setImg(e.target.files?.[0] || null)}
        />
        <label htmlFor="file" className="flex items-center">
          <PhotoIcon className="h-6 cursor-pointer" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
