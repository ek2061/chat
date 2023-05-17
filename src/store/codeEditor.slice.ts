import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface codeEditorState {
  open: boolean;
  lang: string;
  code: string;
}

const initialState: codeEditorState = {
  open: false,
  lang: "javascript",
  code: "",
};

export const codeEditorSlice = createSlice({
  name: "codeEditor",
  initialState,
  reducers: {
    openEditor: (state) => {
      state.open = true;
    },
    closeEditor: (state) => {
      state.open = initialState.open;
      state.lang = initialState.lang;
      state.code = initialState.code;
    },
    setLang: (state, action: PayloadAction<codeEditorState["lang"]>) => {
      const lang = action.payload;
      state.lang = lang;
    },
    setCode: (state, action: PayloadAction<codeEditorState["code"]>) => {
      const code = action.payload;
      state.code = code;
    },
  },
});

export const { openEditor, closeEditor, setLang, setCode } =
  codeEditorSlice.actions;
