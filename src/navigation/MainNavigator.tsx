import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useApp } from "../storage/context/AppContext"; // Import AppContext
import { useAuth } from "../storage/context/AuthContext"; // Import AuthContext
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

// Defining the types for the navigation context
type MainNavigatorProps = {};

const MainNavigator: React.FC<MainNavigatorProps> = () => {
  const { isLoggedIn } = useAuth(); // Get authentication state from AuthContext
  const { theme, language } = useApp(); // Get theme and language from AppContext

  return (
    // Ensure there is only one NavigationContainer here
    <NavigationContainer>
      {/* Conditionally render the stack based on login state */}
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default MainNavigator;
