import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface appState {
  isSidebarOpen: boolean;
  windowWidth: number;
}

const initialState: appState = {
  isSidebarOpen: false,
  windowWidth: window.innerWidth,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setWindowWidth: (state, action: PayloadAction<number>) => {
      state.windowWidth = action.payload;
    },
  },
});

export const { toggleSidebar, closeSidebar, setWindowWidth } = appSlice.actions;
