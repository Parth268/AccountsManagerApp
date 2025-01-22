import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create AppContext
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

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

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem("language", lang); // Save to AsyncStorage
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, changeLanguage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
