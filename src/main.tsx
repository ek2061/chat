import App from "@/App";
import "@/styles/main.css";
import i18n from "i18next";
import React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import enTranslation from "./locales/en.json";
import zhTranslation from "./locales/zh.json";
import { store } from "./store";

const browserLanguage = navigator.language;
const defaultLanguage = browserLanguage.substring(0, 2) === "zh" ? "zh" : "en";

i18n.init({
  lng: defaultLanguage,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  resources: {
    en: {
      translation: enTranslation,
    },
    zh: {
      translation: zhTranslation,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
