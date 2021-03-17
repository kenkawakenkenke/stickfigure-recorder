import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";
import messages from "./messages.json";

const resources = messages;

i18n
    .use(detector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        keySeparator: false,
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;