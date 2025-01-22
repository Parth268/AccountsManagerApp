import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULTS } from "../../utils/constants"; // Assuming you have a constants file for default values

const LanguageSelectionScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // List of languages to display
  const languages = [
    { id: "1", name: "Hindi", symbol: "अ", bgColor: "#DDEFFF", symbolColor: "#007AFF" },
    { id: "2", name: "English", symbol: "A", bgColor: "#E8F5E9", symbolColor: "#2ECC71" },
    { id: "3", name: "Bengali", symbol: "আ", bgColor: "#FFF3E0", symbolColor: "#E67E22" },
    { id: "4", name: "Marathi", symbol: "आ", bgColor: "#FDEFEF", symbolColor: "#E74C3C" },
    { id: "5", name: "Telugu", symbol: "అ", bgColor: "#FFF8E1", symbolColor: "#F1C40F" },
    { id: "6", name: "Tamil", symbol: "அ", bgColor: "#E8F0FF", symbolColor: "#2980B9" },
    { id: "7", name: "Malayalam", symbol: "അ", bgColor: "#F3F3F3", symbolColor: "#27AE60" },
    { id: "8", name: "Kannada", symbol: "ಅ", bgColor: "#EDE7F6", symbolColor: "#8E44AD" },
    { id: "9", name: "Gujarati", symbol: "અ", bgColor: "#FFFDE7", symbolColor: "#F39C12" },
  ];

  // Load the selected language from AsyncStorage when the component mounts
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(DEFAULTS.LANGUAGE);
        if (savedLanguage) {
          setSelectedLanguage(JSON.parse(savedLanguage));
        }
      } catch (error) {
        console.error("Failed to load language:", error);
      }
    };
    loadLanguage();
  }, []);

  // Save the selected language to AsyncStorage and navigate to the Login screen
  const handleLanguageSelect = async (language) => {
    try {
      console.log("COUNTRY")
      await AsyncStorage.setItem(DEFAULTS.LANGUAGE, JSON.stringify(language));
      setSelectedLanguage(language);
      
      // After saving the language, navigate to the Login screen
      navigation.navigate("Login"); // Ensure "Login" screen is registered in your navigation stack
    } catch (error) {
      console.error("Failed to save language:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Language</Text>
      <Text style={styles.subtitle}>भाषा चुनें</Text>

      <FlatList
        data={languages}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.languageButton,
              { backgroundColor: item.bgColor },
              selectedLanguage?.id === item.id && styles.selectedButton, // Highlight selected language
            ]}
            onPress={() => handleLanguageSelect(item)}
          >
            <Text style={[styles.languageSymbol, { color: item.symbolColor }]}>
              {item.symbol}
            </Text>
            <Text style={styles.languageName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000000",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#555555",
    marginBottom: 20,
  },
  languageButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    height: 100,
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  selectedButton: {
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  languageSymbol: {
    fontSize: 32,
    fontWeight: "bold",
  },
  languageName: {
    fontSize: 14,
    color: "#555555",
    marginTop: 5,
  },
});

export default LanguageSelectionScreen;
