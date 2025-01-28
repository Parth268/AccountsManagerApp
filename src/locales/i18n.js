// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // pass the i18next instance to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          key: "Hello World"
        }
      },
      de: {
        translation: {
          key: "Hallo Welt"
        }
      }
    },
    lng: "en", // default language
    fallbackLng: "en", // fallback language
    interpolation: {
      escapeValue: false, // not needed for React as it escapes by default
    },
  });

export default i18n;
