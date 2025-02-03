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
import { DEFAULTS } from "../../utils/constants"; // Assuming you have a constants file for default values
import { useTranslation } from "react-i18next";
import { StackActions, NavigationProp } from '@react-navigation/native';
import { useAppTheme } from "../../storage/context/ThemeContext"; // Import the theme hook

// Define the type for the language object
interface Language {
  id: string;
  name: string;
  symbol: string;
  code: string;
  bgColor: string;
  symbolColor: string;
}

// Define the type for the component props
interface ChagneLanguageProps {
  navigation: NavigationProp<any>;
}

const ChangeLanguage: React.FC<ChagneLanguageProps> = ({ navigation }) => {
  const { theme, themeProperties } = useAppTheme(); // Get theme properties
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t, i18n } = useTranslation();

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
      const savedLanguage = await AsyncStorage.getItem(DEFAULTS.LANGUAGE);
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
      if (i18n && typeof i18n.changeLanguage === 'function') {
        await i18n.changeLanguage(language.code);
        await AsyncStorage.setItem(DEFAULTS.LANGUAGE, JSON.stringify(language));
        await AsyncStorage.setItem(DEFAULTS.IS_OPEN_FIRST_TIME, "true");
        setSelectedLanguage(language);
        console.log('Language saved successfully!');
      } else {
        console.error('i18n is not initialized or changeLanguage is not a function.');
      }
      // After saving the language, navigate to the Login screen
      navigation.dispatch(StackActions.pop(1)); // You can pass any number here to pop multiple screens
    } catch (error) {
      console.error("Failed to save language:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <View style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={themeProperties.textColor} />
            <Text style={[styles.loadingText, { color: themeProperties.textColor }]}>Loading...</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}>
          <Text style={[styles.title, { color: themeProperties.textColor }]}>Choose Language</Text>
          <Text style={[styles.subtitle, { color: themeProperties.textColor }]}>भाषा चुनें</Text>

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
                <Text style={[styles.languageName, { color: themeProperties.lightbgtextColor }]}>{item.name}</Text>
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
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
    paddingTop: 50,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
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
    marginTop: 5,
  },
});

export default ChangeLanguage;
