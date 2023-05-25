import { db } from "@/firebase";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import Modal from "@/modules/Modal";
import { closeEditor, setCode, setLang } from "@/store/codeEditor.slice";
import "@/styles/prism.css";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-typescript";
import React from "react";
import Editor from "react-simple-code-editor";
import { v4 as uuidv4 } from "uuid";

const CodeEditorModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { open, lang, code } = useAppSelector((state) => state.codeEditor);
  const { authData, chatData } = useAppSelector((state) => state.user);

  const handleSend = async () => {
    if (!authData.currentUser?.uid || !chatData?.user?.uid || !chatData.chatId)
      return;

    if (!code) return;

    await addDoc(collection(db, "chats", chatData.chatId, "messages"), {
      id: uuidv4(),
      text: code,
      lang: lang,
      senderId: authData.currentUser.uid,
      date: Timestamp.now(),
    });

    await updateDoc(doc(db, "userChats", authData.currentUser.uid), {
      [`${chatData.chatId}.lastMessage`]: "📋",
      [`${chatData.chatId}.date`]: serverTimestamp(),
      [`${chatData.chatId}.sender`]: "you",
    });

    await updateDoc(doc(db, "userChats", chatData.user.uid), {
      [`${chatData.chatId}.lastMessage`]: "📋",
      [`${chatData.chatId}.date`]: serverTimestamp(),
      [`${chatData.chatId}.sender`]: authData.currentUser.displayName,
    });

    dispatch(closeEditor());
  };

  const funcHighlight = (code: string) => {
    switch (lang) {
      case "java":
        return highlight(code, languages.java, "java");
      case "python":
        return highlight(code, languages.python, "python");
      case "javascript":
        return highlight(code, languages.javascript, "javascript");
      case "typescript":
        return highlight(code, languages.typescript, "typescript");
      default:
        return code;
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => dispatch(closeEditor())}
      title="add your code"
      action={
        <button
          className="cursor-pointer rounded-md border-none bg-blue-500 px-4 py-2.5 text-white hover:bg-blue-600"
          onClick={handleSend}
        >
          Send
        </button>
      }
    >
      <div className="space-y-2">
        <div className="flex space-x-2 px-3">
          <p className="text-sm">Language: </p>
          <select
            className="h-6 w-28 rounded-sm border-none"
            name="language"
            value={lang}
            onChange={(e) => dispatch(setLang(e.target.value))}
          >
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
          </select>
        </div>

        <div className="h-60 overflow-auto">
          <Editor
            value={code}
            onValueChange={(code) => dispatch(setCode(code))}
            highlight={funcHighlight}
            className="min-h-[240px] bg-gray-900 text-sm text-gray-100"
            padding={10}
            placeholder="paste your code here..."
          />
        </div>
      </div>
    </Modal>
  );
};

export default CodeEditorModal;
