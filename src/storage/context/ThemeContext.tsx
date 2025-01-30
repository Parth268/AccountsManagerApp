import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define default constants
const DEFAULTS = {
  APP_THEME: "appTheme", // Key to save theme in AsyncStorage
};

// Define the theme structure
interface Theme {
  textColor: string;
  backgroundColor: string;
  textSize: number;
}

// Define the theme context type
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  themeProperties: Theme;
}

// Define the light and dark themes
const themes: Record<"light" | "dark", Theme> = {
  light: {
    textColor: "#000000",
    backgroundColor: "#FFFFFF",
    textSize: 16,
  },
  dark: {
    textColor: "#FFFFFF",
    backgroundColor: "#121212",
    textSize: 18,
  },
};

// Create the ThemeContext
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the theme context
export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
};

// Custom hook to detect the system theme
const useSystemTheme = () => {
  const scheme = useColorScheme();
  return scheme === "dark" ? "dark" : "light";
};

// ThemeProvider component to provide the theme context
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemTheme = useSystemTheme();
  const [theme, setTheme] = useState<"light" | "dark">(systemTheme);

  // Load saved theme from AsyncStorage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(DEFAULTS.APP_THEME);
        if (savedTheme) {
          setTheme(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.error("Failed to load theme from AsyncStorage", error);
      }
    };

    loadTheme();
  }, []);

  // Save theme to AsyncStorage whenever it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem(DEFAULTS.APP_THEME, JSON.stringify(theme));
      } catch (error) {
        console.error("Failed to save theme to AsyncStorage", error);
      }
    };

    saveTheme();
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const themeProperties = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeProperties }}>
      {children}
    </ThemeContext.Provider>
  );
};
