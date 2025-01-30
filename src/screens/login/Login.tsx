import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { NavigationProp } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import { NAVIGATION, STORAGE_KEYS } from "../../utils/constants";
import { useAuth } from "../../storage/context/AuthContext";
import { Snackbar } from "../../components/Snackbar";
import { useAppTheme } from "../../storage/context/ThemeContext";

interface LoginProps {
  navigation: NavigationProp<any>;
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { theme, themeProperties } = useAppTheme();

  const [email, setEmail] = useState<string>("parth26.8patel@gmail.com");
  const [password, setPassword] = useState<string>("1234567890Q");
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const triggerSnackbar = (message: string = "") => {
    setSnackbarMessage(message);
    setTimeout(() => setSnackbarMessage(""), 2000); // Clear after 2 seconds
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Store email in AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
      // Attempt login
      await signInWithEmailPassword();
    } catch (error) {
      setLoading(false);
      triggerSnackbar(t("error_message"));
    }
  };

  const signInWithEmailPassword = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      setLoading(false);

      if (userCredential) {
        // Save user ID and login state
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userCredential.user.uid);
        triggerSnackbar(t("login_success"));
        setTimeout(() => login(JSON.stringify(userCredential)), 500);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      triggerSnackbar(t("login_failed"));
    }
  };

  const handleRegisterNavigation = () => {
    navigation.navigate(NAVIGATION.REGISTRATION);
  };

  const handlefogetpassword = () => {
    navigation.navigate(NAVIGATION.FORGET_PASSWORD);
  }

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeProperties.backgroundColor,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    text: {
      color: themeProperties.textColor,
      fontSize: themeProperties.textSize,
    },
    input: {
      width: "90%",
      height: 50,
      backgroundColor: themeProperties.backgroundColor,
      borderRadius: 15,
      paddingHorizontal: 15,
      fontSize: 16,
      marginTop: 20,
      borderWidth: 1,
      borderColor: "#DDDDDD",
      color: themeProperties.textColor,
    },
    button: {
      width: "90%",
      backgroundColor: "#000000",
      paddingVertical: 15,
      borderRadius: 15,
      alignItems: "center",
      marginTop: 10,
    },
    buttondark: {
      width: "90%",
      backgroundColor: "#808080",
      paddingVertical: 15,
      borderRadius: 15,
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 16,
    },
    registerButton: {
      marginTop: 25,
    },
    registerButtonText: {
      color: themeProperties.textColor,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <View style={{ marginBottom: 30, alignItems: "center" }}>
        <Text style={[dynamicStyles.text, { fontSize: 28, fontWeight: "bold" }]}>
          {t("greeting")}
        </Text>
        <Text style={[dynamicStyles.text, { fontSize: 22, marginTop: 5 }]}>
          {t("get_started")}
        </Text>
        <Text style={[dynamicStyles.text, { fontSize: 14, marginVertical: 15 }]}>
          {t("login_description")}
        </Text>
      </View>

      <TextInput
        style={dynamicStyles.input}
        placeholder={t("email_placeholder")}
        keyboardType="email-address"
        value={email}
        onChangeText={(text: string) => setEmail(text)}
        placeholderTextColor="#AAAAAA"
      />
      <TextInput
        style={dynamicStyles.input}
        placeholder={t("password_placeholder")}
        secureTextEntry
        value={password}
        onChangeText={(text: string) => setPassword(text)}
        placeholderTextColor="#AAAAAA"
      />

      <Pressable onPress={handlefogetpassword} style={{
        justifyContent: 'flex-end',
        width: "85%", alignContent: 'flex-end',
        alignItems: 'flex-end', marginVertical: 10, marginTop: 18,
      }}>

        <Text style={[dynamicStyles.text, { fontSize: 14, }]}>
          {t("forget_password")}
        </Text>
      </Pressable>

      <TouchableOpacity
        style={theme === "light" ? dynamicStyles.button : dynamicStyles.buttondark}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={dynamicStyles.buttonText}>{t("login_button")}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={dynamicStyles.registerButton}
        onPress={handleRegisterNavigation}
      >
        <Text style={dynamicStyles.registerButtonText}>{t("register_button")}</Text>
      </TouchableOpacity>

      {snackbarMessage ? <Snackbar message={snackbarMessage} /> : null}
    </View>
  );
};

export default Login;
