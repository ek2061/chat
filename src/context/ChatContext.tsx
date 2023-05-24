import { createContext, ReactNode, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

interface ChatState {
  chatId: string;
  user: {
    uid: string;
    displayName: string;
    photoURL: string;
  };
}

interface ChatAction {
  type: string;
  payload: {
    uid: string;
    displayName: string;
    photoURL: string;
  };
}

interface ChatContextType {
  data: ChatState;
  dispatch: (action: ChatAction) => void;
}

export const ChatContext = createContext<ChatContextType>(
  {} as ChatContextType
);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE: ChatState = {
    chatId: "null",
    user: { uid: "", displayName: "", photoURL: "" },
  };

  const chatReducer = (state: ChatState, action: ChatAction) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser?.uid && action.payload.uid
              ? currentUser.uid > action.payload.uid
                ? currentUser.uid + action.payload.uid
                : action.payload.uid + currentUser.uid
              : "",
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
