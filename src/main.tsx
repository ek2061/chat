import App from "@/App";
import "@/styles/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import { store } from "./store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthContextProvider>
        <ChatContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ChatContextProvider>
      </AuthContextProvider>
    </Provider>
  </React.StrictMode>
);
