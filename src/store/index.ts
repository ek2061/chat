import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import { appSlice } from "./app.slice";
import { codeEditorSlice } from "./codeEditor.slice";
import { userSlice } from "./user.slice";

const reducer = combineReducers({
  app: appSlice.reducer,
  user: userSlice.reducer,
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
