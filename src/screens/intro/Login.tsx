import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { NAVIGATION, STORAGE_KEYS } from "../../utils/constants";
import { NavigationProp } from "@react-navigation/native";

interface LoginProps {
  navigation: NavigationProp<any>;
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState<string>("9876543210");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (phoneNumber.length === 10) {
      setLoading(true);

      try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_PHONE_NUMBER, phoneNumber);

        setTimeout(() => {
          setLoading(false);
          navigation.navigate(NAVIGATION.OTPSCREEN);
        }, 100);
      } catch (error) {
        setLoading(false);
        Alert.alert(t('error'), t('error_message'));
      }
    } else {
      Alert.alert(t('invalid_phone_number_title'), t('invalid_phone_number'));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{t('greeting')}</Text>
        <Text style={styles.subtitle}>{t('get_started')}</Text>
        <Text style={styles.description}>{t('login_description')}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder={t('phone_number_placeholder')}
        keyboardType="numeric"
        maxLength={10}
        value={phoneNumber}
        onChangeText={(text: string) => setPhoneNumber(text)}
        placeholderTextColor="#AAAAAA"
        autoFocus
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
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
    backgroundColor: "#FFFFFF",
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
    color: "#333333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 22,
    color: "#444444",
    textAlign: "center",
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginVertical: 15,
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#F9F9F9",
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    color: "#333333",
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
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Login;