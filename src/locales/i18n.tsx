import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en/translation.json'
import gu from './gu/translation.json'
import hi from './hi/translation.json'
import mr from './mr/translation.json'; // Marathi language
import bn from './bn/translation.json'; // Bengali language
import ta from './ta/translation.json'; // Tamil language
import te from './te/translation.json'; // Telugu language
import kn from './kn/translation.json'; // Kannada language
import ml from './ml/translation.json'; // Punjabi language

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
      gu: { translation: gu },
      hi: { translation: hi },
      mr: { translation: mr },
      bn: { translation: bn },
      ta: { translation: ta },
      te: { translation: te },
      kn: { translation: kn },
      ml: { translation: ml },
    }
  });

export default i18n;