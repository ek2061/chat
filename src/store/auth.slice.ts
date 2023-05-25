import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

interface authState {
  currentUser: User | null;
  isLoading: boolean;
}

const initialState: authState = {
  currentUser: null,
  isLoading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (
      state,
      action: PayloadAction<authState["currentUser"]>
    ) => {
      state.currentUser = action.payload;
      state.isLoading = false;
    },
    setLoading: (state) => {
      state.isLoading = true;
    },
  },
});

export const { setCurrentUser, setLoading } = authSlice.actions;
