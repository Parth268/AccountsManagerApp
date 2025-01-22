// src/i18n/index.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULTS } from '../utils/constants';

const resources = {
  en: { translation: { welcome: 'Welcome', switchLang: 'Switch Language' } },
  es: { translation: { welcome: 'Bienvenido', switchLang: 'Cambiar idioma' } },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    initImmediate: false,
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
  });

// Persist language preference
i18n.services.languageUtils.loadSavedLanguage = async () => {
  const savedLanguage = await AsyncStorage.getItem(DEFAULTS.LANGUAGE);
  if (savedLanguage) i18n.changeLanguage(savedLanguage);
};
