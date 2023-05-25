import { ChatContext } from "@/context/ChatContext";
import { db, storage } from "@/firebase";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import Preview from "@/modules/Preview";
import { openEditor } from "@/store/codeEditor.slice";
import { blob2base64 } from "@/utils/image";
import { CodeBracketIcon, PhotoIcon } from "@heroicons/react/24/outline";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CodeEditorModal from "./CodeEditorModal";

const Input: React.FC = () => {
  const [text, setText] = useState<string>(""); // text of input box
  const [img, setImg] = useState<File | null>(null); // selected image file
  const [preview, setPreview] = useState<string>(""); // selected image preview

  const dispatch = useAppDispatch();
  const { open } = useAppSelector((state) => state.codeEditor);
  const { currentUser } = useAppSelector((state) => state.auth);

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
          await addDoc(collection(db, "chats", data.chatId, "messages"), {
            id: uuidv4(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            img: downloadURL,
          });
        }
      );
    } else {
      if (!text) return;

      await addDoc(collection(db, "chats", data.chatId, "messages"), {
        id: uuidv4(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [`${data.chatId}.lastMessage`]: img ? "📷" : text,
      [`${data.chatId}.date`]: serverTimestamp(),
      [`${data.chatId}.sender`]: "you",
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [`${data.chatId}.lastMessage`]: img ? "📷" : text,
      [`${data.chatId}.date`]: serverTimestamp(),
      [`${data.chatId}.sender`]: currentUser.displayName,
    });

    setText("");
    setImg(null);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && text) {
      e.currentTarget.value = "";
      handleSend();
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          if (blob instanceof File) {
            await blob2base64(blob);
            setImg(blob);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (!img) {
      setPreview("");
      return;
    }

    const uploadPreview = async () => {
      const imageSrc = await blob2base64(img);
      setPreview(imageSrc);
    };

    uploadPreview();
  }, [img]);

  return (
    <div className="relative">
      {img && (
        <div className="z-100 absolute -top-20 flex w-full justify-start space-x-3 rounded-s px-2 opacity-80">
          <Preview src={preview} onClose={() => setImg(null)} />
        </div>
      )}

      <div className="flex h-12 items-center justify-between bg-white p-2.5">
        <input
          className="w-full border-none text-lg text-navbar outline-none placeholder:text-gray-400"
          type="text"
          placeholder="type something here..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          onPaste={handlePaste}
        />

        <div className="flex items-center gap-2.5">
          <CodeBracketIcon
            className="h-6 cursor-pointer"
            onClick={() => dispatch(openEditor())}
          />

          <input
            type="file"
            accept="image/jpeg, image/png, image/gif"
            className="hidden"
            id="file"
            onChange={(e) => setImg(e.target.files?.[0] || null)}
            onClick={(e) => ((e.target as HTMLInputElement).value = "")}
          />
          <label htmlFor="file" className="flex items-center">
            <PhotoIcon className="h-6 cursor-pointer" />
          </label>
          <button
            className="cursor-pointer rounded-lg border-none bg-blue-500 px-4 py-2.5 text-white hover:bg-blue-600"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>

      {open && <CodeEditorModal />}
    </div>
  );
};

export default Input;
