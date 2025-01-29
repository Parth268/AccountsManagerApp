import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en/translation.json'
import gu from './gu/translation.json'

i18n
  .use(initReactI18next) // Pass the i18n instance to react-i18next
  .init({
    fallbackLng: 'en', // Default language
    debug: true, // Enable debug logs
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    lng: 'en',
    resources: {
      en: { translation: en },
      gu: { translation: gu }
    }
  });

export default i18n;