import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULTS, NAVIGATION } from "../../utils/constants"; // Assuming you have a constants file for default values
import { useTranslation } from "react-i18next";
import { NavigationProp } from "@react-navigation/native"; // Import NavigationProp for type safety
import { useLanguage } from "../../storage/context/LanguageContext";

// Define the type for a language object
interface Language {
  id: string;
  name: string;
  symbol: string;
  code: string;
  bgColor: string;
  symbolColor: string;
}

// Define the props for the component
interface LanguageSelectionScreenProps {
  navigation: NavigationProp<any>; // Use NavigationProp for type safety
}

const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { changeLanguage } = useLanguage();

  // List of languages to display
  const languages: Language[] = [
    { id: "1", name: "Hindi", symbol: "अ", code: "hi", bgColor: "#DDEFFF", symbolColor: "#007AFF" },
    { id: "2", name: "English", symbol: "A", code: "en", bgColor: "#E8F5E9", symbolColor: "#2ECC71" },
    { id: "3", name: "Bengali", symbol: "আ", code: "bn", bgColor: "#FFF3E0", symbolColor: "#E67E22" },
    { id: "4", name: "Marathi", symbol: "आ", code: "mr", bgColor: "#FDEFEF", symbolColor: "#E74C3C" },
    { id: "5", name: "Telugu", symbol: "అ", code: "te", bgColor: "#FFF8E1", symbolColor: "#F1C40F" },
    { id: "6", name: "Tamil", symbol: "அ", code: "ta", bgColor: "#E8F0FF", symbolColor: "#2980B9" },
    { id: "7", name: "Malayalam", symbol: "അ", code: "ml", bgColor: "#F3F3F3", symbolColor: "#27AE60" },
    { id: "8", name: "Kannada", symbol: "ಅ", code: "kn", bgColor: "#EDE7F6", symbolColor: "#8E44AD" },
    { id: "9", name: "Gujarati", symbol: "અ", code: "gu", bgColor: "#FFFDE7", symbolColor: "#F39C12" },
  ];

  // Load the selected language from AsyncStorage when the component mounts
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const [savedLanguage, isFirstLanguage] = await Promise.all([
        AsyncStorage.getItem(DEFAULTS.LANGUAGE),
        AsyncStorage.getItem(DEFAULTS.IS_OPEN_FIRST_TIME),
      ]);

      if (savedLanguage && isFirstLanguage) {
        navigation.navigate(NAVIGATION.LOGIN);
      }

      if (savedLanguage) {
        setSelectedLanguage(JSON.parse(savedLanguage));
      }
    } catch (error) {
      console.error("Failed to load language:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save the selected language to AsyncStorage and navigate to the Login screen
  const handleLanguageSelect = async (language: Language) => {
    try {

      await changeLanguage(language.code);
      await AsyncStorage.setItem(DEFAULTS.LANGUAGE, JSON.stringify(language));
      await AsyncStorage.setItem(DEFAULTS.IS_OPEN_FIRST_TIME, "true");
      setSelectedLanguage(language);

      // After saving the language, navigate to the Login screen
      navigation.navigate(NAVIGATION.LOGIN); // Ensure "Login" screen is registered in your navigation stack
    } catch (error) {
      console.error("Failed to save language:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <View style={styles.container}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      ) : (
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
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
    paddingTop: 50
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6200ee',
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