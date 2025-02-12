import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import i18n from '../../locales/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../utils/constants';

interface LanguageContextType {
  language: string;
  textSize: number;
  isDefaultText: boolean;
  changeDefaultText: () => Promise<void>;
  changeLanguage: (lng: string) => Promise<void>;
  changeTextSize: (size: number) => Promise<void>;
}

interface LanguageProviderProps {
  children: ReactNode;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<string>('en');
  const [textSize, setTextSize] = useState<number>(1); // Default text size
  const [isDefaultText, setIsDefaultText] = useState<boolean>(true); // Default false

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
        const savedTextSize = await AsyncStorage.getItem(STORAGE_KEYS.TEXT_SIZE);
        const savedDefaultText = await AsyncStorage.getItem(STORAGE_KEYS.IS_DEFAULT_SIZE);

        if (savedLanguage) {
          setLanguage(savedLanguage);
          i18n.changeLanguage(savedLanguage);
        }

        if (Boolean(!savedDefaultText)) {
          if (savedTextSize && !isNaN(parseInt(savedTextSize, 1))) {
            setTextSize(parseInt(savedTextSize, 1));
          } else {
            setTextSize(1);
            await AsyncStorage.setItem(STORAGE_KEYS.TEXT_SIZE, "1");
          }
        }

        if (savedDefaultText !== null) {
          setIsDefaultText(savedDefaultText === "true");
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  

  const changeLanguage = async (lng: string) => {
    setLanguage(lng);
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lng);
    i18n.changeLanguage(lng);
  };

  const changeTextSize = async (size: number) => {
    setTextSize(size);
    await AsyncStorage.setItem(STORAGE_KEYS.TEXT_SIZE, size.toString());
  };

  const changeDefaultText = async () => {
    const newValue = !isDefaultText;
    setIsDefaultText(newValue);
    await AsyncStorage.setItem(STORAGE_KEYS.IS_DEFAULT_SIZE, newValue.toString());
  };

  return (
    <LanguageContext.Provider value={{ language, textSize, isDefaultText, changeDefaultText, changeLanguage, changeTextSize }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
