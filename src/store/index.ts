import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import { codeEditorSlice } from "./codeEditor.slice";

const reducer = combineReducers({
  codeEditor: codeEditorSlice.reducer,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware()],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;
