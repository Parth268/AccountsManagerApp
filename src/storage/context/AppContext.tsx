import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define types for the context values
interface AppContextType {
  theme: string;
  toggleTheme: () => Promise<void>;
  language: string;
  changeLanguage: (lang: string) => Promise<void>;
}

// Create AppContext with default values
const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [theme, setTheme] = useState<string>("light");
  const [language, setLanguage] = useState<string>("en");

  // Load theme and language from AsyncStorage (optional)
  useEffect(() => {
    const loadSettings = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      const storedLanguage = await AsyncStorage.getItem("language");

      if (storedTheme) setTheme(storedTheme);
      if (storedLanguage) setLanguage(storedLanguage);
    };

    loadSettings();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme); // Save to AsyncStorage
  };

  const changeLanguage = async (lang: string) => {
    setLanguage(lang);
    await AsyncStorage.setItem("language", lang); // Save to AsyncStorage
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, changeLanguage }}>
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
