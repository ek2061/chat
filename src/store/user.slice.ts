import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

interface userState {
  authData: {
    currentUser: User | null;
    isLoading: boolean;
  };
  chatData: {
    chatId: string | null;
    user: {
      uid: string;
      displayName: string;
      photoURL: string;
    };
  };
}

const initialState: userState = {
  authData: {
    currentUser: null,
    isLoading: true,
  },
  chatData: {
    chatId: null,
    user: {
      uid: "",
      displayName: "",
      photoURL: "",
    },
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (
      state,
      action: PayloadAction<userState["authData"]["currentUser"]>
    ) => {
      state.authData.currentUser = action.payload;
      state.authData.isLoading = false;
    },
    setLoading: (state) => {
      state.authData.isLoading = true;
    },
    changeChatUser: (
      state,
      action: PayloadAction<userState["chatData"]["user"]>
    ) => {
      const { uid, displayName, photoURL } = action.payload;

      state.chatData.user = { uid, displayName, photoURL };

      const { currentUser } = state.authData;

      state.chatData.chatId =
        currentUser?.uid && action.payload.uid
          ? currentUser.uid > action.payload.uid
            ? currentUser.uid + action.payload.uid
            : action.payload.uid + currentUser.uid
          : null;
    },
  },
});

export const { setCurrentUser, setLoading, changeChatUser } = userSlice.actions;
