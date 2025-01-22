import React from "react";
import { View, Text, Button } from "react-native";
import { useApp } from "../../storage/context/AppContext";

const SettingsScreen = () => {
  const { theme, toggleTheme, language, changeLanguage } = useApp();

  return (
    <View>
      <Text>Current Theme: {theme}</Text>
      <Text>Current Language: {language}</Text>

      <Button title="Toggle Theme" onPress={toggleTheme} />
      <Button title="Change to French" onPress={() => changeLanguage("fr")} />
      <Button title="Change to Spanish" onPress={() => changeLanguage("es")} />
    </View>
  );
};

export default SettingsScreen;
