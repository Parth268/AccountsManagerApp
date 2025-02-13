import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useApp } from "../storage/context/AppContext"; // Import AppContext
import { useAuth } from "../storage/context/AuthContext"; // Import AuthContext
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

const MainNavigator: React.FC = () => {
  const { isLoggedIn } = useAuth(); // Get authentication state from AuthContext
  const { theme } = useApp(); // Get theme from AppContext
  const [navKey, setNavKey] = useState(0);

  // Update key when theme changes to force NavigationContainer to remount
  useEffect(() => {
    setNavKey(prevKey => prevKey + 1);
  }, [theme]);

  return (
    <NavigationContainer key={navKey}>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default MainNavigator;
