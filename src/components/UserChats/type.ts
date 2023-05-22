import { Timestamp } from "firebase/firestore";

export interface ChatsData {
  [key: string]: {
    date: Timestamp;
    lastMessage: string;
    sender: string;
    userInfo: {
      uid: string;
      displayName: string;
      email: string;
      photoURL: string;
    };
  };
}
