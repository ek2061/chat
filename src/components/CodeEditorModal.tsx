import { AuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";
import { db } from "@/firebase";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import Modal from "@/modules/Modal";
import { closeEditor, setCode, setLang } from "@/store/codeEditor.slice";
import "@/styles/prism.css";
import {
  arrayUnion,
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
import React, { useContext } from "react";
import Editor from "react-simple-code-editor";
import { v4 as uuidv4 } from "uuid";

const CodeEditorModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { open, lang, code } = useAppSelector((state) => state.codeEditor);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (!currentUser?.uid || !data?.user?.uid) return;

    if (!code) return;

    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuidv4(),
        text: code,
        lang: lang,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });

    const combinedId =
      currentUser.uid > data.user.uid
        ? currentUser.uid + data.user.uid
        : data.user.uid + currentUser.uid;

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [`${combinedId}.lastMessage`]: "📋",
      [`${combinedId}.date`]: serverTimestamp(),
      [`${combinedId}.sender`]: "you",
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [`${combinedId}.lastMessage`]: "📋",
      [`${combinedId}.date`]: serverTimestamp(),
      [`${combinedId}.sender`]: currentUser.displayName,
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
