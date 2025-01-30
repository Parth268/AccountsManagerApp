import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { NavigationProp } from "@react-navigation/native";
import auth from '@react-native-firebase/auth';
import { NAVIGATION, STORAGE_KEYS } from "../../utils/constants";
import { useAuth } from "../../storage/context/AuthContext";
import { Snackbar } from "../../components/Snackbar";

interface LoginProps {
  navigation: NavigationProp<any>;
}

const Login: React.FC<LoginProps> = ({ navigation }) => {

  const { t } = useTranslation();
  const { login } = useAuth()
  const [email, setEmail] = useState<string>("pvfgg@gmail.com");
  const [password, setPassword] = useState<string>("1234567890Q");
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const triggerSnackbar = (textData: string = "") => {
    setSnackbarMessage(textData);
    setTimeout(() => setSnackbarMessage(""), 1000); // Clear message after snackbar hides
  };
  const handleLogin = async () => {
    setLoading(true);
    try {
      // Store email in AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
      // Attempt to sign in using email and password
      await signInWithEmailPassword();
    } catch (error) {
      setLoading(false);
      Alert.alert(t('error'), t('error_message'));
    }
  };

  const signInWithEmailPassword = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      setLoading(false);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
      if (userCredential) {
          await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userCredential?.user?.uid);
          triggerSnackbar(String(t("login_success")));

          setTimeout(()=>{
              setLoading(false);
              login(JSON.stringify(userCredential))
          },800)

      }
      // Navigate to the next screen upon successful login
      // Update with your home screen navigation
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert(t('error'), t('login_failed'));
    }
  };

  const handleRegisterNavigation = () => {
    // Navigate to the registration screen
    navigation.navigate(NAVIGATION.REGISTRATION);  // Update with your registration screen navigation
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
        placeholder={t('email_placeholder')}
        keyboardType="email-address"
        value={email}
        onChangeText={(text: string) => setEmail(text)}
        placeholderTextColor="#AAAAAA"
        autoFocus
      />
      <TextInput
        style={styles.input}
        placeholder={t('password_placeholder')}
        secureTextEntry
        value={password}
        onChangeText={(text: string) => setPassword(text)}
        placeholderTextColor="#AAAAAA"
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.loginButtonText}>{t('login_button')}</Text>
        )}
      </TouchableOpacity>

      {/* Registration Button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegisterNavigation}>
        <Text style={styles.registerButtonText}>{t('register_button')}</Text>
      </TouchableOpacity>

      {snackbarMessage ? <Snackbar message={snackbarMessage} /> : null}

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
  description: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginVertical: 15,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 22,
    color: "#444444",
    textAlign: "center",
    marginTop: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
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
    color: "#333333",
  },
  loginButton: {
    width: "90%",
    backgroundColor: "#000000",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
  },
  loginButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  registerButton: {
    alignItems: "center",
    marginTop: 25,
  },
  registerButtonText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "bold",
  },
});

export default Login;
