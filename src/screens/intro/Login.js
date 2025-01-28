import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next"; // import hook for translation
import { STORAGE_KEYS } from "../../utils/constants";
// import '../../locales/i18n'; // Import the i18n configuration

const Login = ({ navigation }) => {
  const { t, i18n } = useTranslation(); // hook to access translations
  const [phoneNumber, setPhoneNumber] = useState("9876543210");
  const [loading, setLoading] = useState(false);

  // Handle login button press
  const handleLogin = async () => {
    if (phoneNumber.length === 10) {
      setLoading(true);

      try {
        // Save phone number in AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.USER_PHONE_NUMBER, phoneNumber);

        setTimeout(() => {
          setLoading(false);
          navigation.navigate("OTPScreen");
        }, 100);
      } catch (error) {
        setLoading(false);
        Alert.alert(t('error'), t('error_message'));
      }
    } else {
      // Invalid phone number
      Alert.alert(t('invalid_phone_number_title'), t('invalid_phone_number'));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{t('greeting')}</Text>
        <Text style={styles.subtitle}>{t('get_started')}</Text>
        <Text style={styles.description}>{t('login_description')}</Text>
      </View>

      {/* Phone Number Input */}
      <TextInput
        style={styles.input}
        placeholder={t('phone_number_placeholder')}
        keyboardType="numeric"
        maxLength={10}
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        placeholderTextColor="#AAAAAA"
        autoFocus
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.loginButtonText}>{t('login_button')}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // White background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333", // Darker text for better readability
    textAlign: "center",
  },
  subtitle: {
    fontSize: 22,
    color: "#444444", // Slightly lighter than title
    textAlign: "center",
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: "#666666", // Neutral gray for description
    textAlign: "center",
    marginVertical: 15,
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#F9F9F9", // Light gray for input background
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#DDDDDD", // Subtle border color
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    color: "#333333", // Dark text for input
  },
  loginButton: {
    width: "90%",
    backgroundColor: "#000000", 
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
    fontSize: 16,
    color: "#FFFFFF", // White text on blue button
    fontWeight: "bold",
  },
});

export default Login;
