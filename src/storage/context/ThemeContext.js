import React, { createContext, useState, useContext } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // Check system theme initially
  const systemTheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(systemTheme || 'light'); // default to 'light'

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme in any component
const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
