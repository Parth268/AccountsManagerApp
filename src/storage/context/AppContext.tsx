import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULTS } from "../../utils/constants";

// Define types for the context values
interface AppContextType {
  theme: string;
  toggleTheme: () => Promise<void>;
  language: string;
  changeLanguage: (lang: string) => Promise<void>;
  changeBusinessName: (businessName: string) => Promise<void>;
  business: string;
}

// Create AppContext with default values
const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [theme, setTheme] = useState<string>("light");
  const [language, setLanguage] = useState<string>("en");
  const [business, setBusiness] = useState<string>("")

  // Load theme and language from AsyncStorage (optional)
  useEffect(() => {
    const loadSettings = async () => {
      const storedTheme = await AsyncStorage.getItem(DEFAULTS.LANGUAGE);
      const storedLanguage = await AsyncStorage.getItem(DEFAULTS.APP_THEME);
      const businessName = await AsyncStorage.getItem(DEFAULTS.BUSINESS_NAME);

      if (storedTheme) setTheme(storedTheme);
      if (storedLanguage) setLanguage(storedLanguage);
      if (businessName) setBusiness(businessName)
    };

    loadSettings();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem(DEFAULTS.APP_THEME, newTheme); // Save to AsyncStorage
  };

  const changeLanguage = async (lang: string) => {
    setLanguage(lang);
    await AsyncStorage.setItem(DEFAULTS.LANGUAGE, lang); // Save to AsyncStorage
  };

  const changeBusinessName = async (businessName: string) => {
    setBusiness(businessName)
    await AsyncStorage.setItem(DEFAULTS.BUSINESS_NAME, businessName); // Save to AsyncStorage
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, changeLanguage, business, changeBusinessName }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
