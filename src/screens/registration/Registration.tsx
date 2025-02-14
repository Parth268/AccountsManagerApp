import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { NavigationProp } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import { useAuth } from "../../storage/context/AuthContext";
import { useAppTheme } from "../../storage/context/ThemeContext";
import { Snackbar } from "../../components/Snackbar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface RegisterProps {
  navigation: NavigationProp<any>;
}

const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { theme, themeProperties } = useAppTheme();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [secureText, setSecureText] = useState(true);

  const triggerSnackbar = (message: string = "") => {
    setSnackbarMessage(message);
    setTimeout(() => setSnackbarMessage(""), 2000); // Clear after 2 seconds
  };

  const handleRegister = async () => {
    setLoading(true);
    if (password !== confirmPassword) {
      setLoading(false);
      triggerSnackbar(t("password_mismatch"));
      return;
    }

    if (password.length < 6) {
      setLoading(false);
      triggerSnackbar(t("password_required_length"));
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      if (userCredential) {
        await AsyncStorage.setItem("USER_EMAIL", email);
        await AsyncStorage.setItem("USER_ID", userCredential.user.uid);
        triggerSnackbar(t("register_success"));

        setTimeout(() => {
          setLoading(false);
          handleLoginNavigation()
          // login(JSON.stringify(userCredential));
        }, 200);
      }
    } catch (error) {
      setLoading(false);
      triggerSnackbar(t("register_failed"));
    }
  };

  const handleLoginNavigation = () => {
    navigation.goBack();
  };

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
      marginTop: 30,
    },
    buttondark: {
      width: "90%",
      backgroundColor: "#808080",
      paddingVertical: 15,
      borderRadius: 15,
      alignItems: "center",
      marginTop: 30,
    },
    buttonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 16,
    },
    loginButton: {
      marginTop: 25,
    },
    loginButtonText: {
      color: themeProperties.textColor,
      fontSize: 16,
      fontWeight: "bold",
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "90%",
      height: 50,
      backgroundColor: "#FFFFFF",
      borderRadius: 15,
      paddingHorizontal: 15,
      fontSize: 16,
      marginTop: 20,
      borderWidth: 1,
      borderColor: "#DDDDDD",
    },
    passwordInput: {
      flex: 1,
      fontSize: 16,
      color: "#000000",
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <View style={{ marginBottom: 30, alignItems: "center" }}>
        <Text style={[dynamicStyles.text, { fontSize: 28, fontWeight: "bold" }]}>
          {t("create_account")}
        </Text>
        <Text style={[dynamicStyles.text, { fontSize: 22, marginTop: 5 }]}>
          {t("signup_description")}
        </Text>
      </View>

      <TextInput
        style={dynamicStyles.input}
        placeholder={t("email_placeholder")}
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholderTextColor="#AAAAAA"
      />

      <View style={dynamicStyles.passwordContainer}>
        <TextInput
          style={dynamicStyles.passwordInput}
          placeholder={t("password_placeholder")}
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#AAAAAA"
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Icon name={secureText ? "eye-off" : "eye"} size={24} color="#AAAAAA" />
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.passwordContainer}>
        <TextInput
          style={dynamicStyles.passwordInput}
          placeholder={t("confirm_password_placeholder")}
          secureTextEntry={secureText}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#AAAAAA"
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Icon name={secureText ? "eye-off" : "eye"} size={24} color="#AAAAAA" />
        </TouchableOpacity>
      </View>

{/*      
      <TextInput
        style={dynamicStyles.input}
        placeholder={t("confirm_password_placeholder")}
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        placeholderTextColor="#AAAAAA"
      /> */}

      <TouchableOpacity
        style={theme === "light" ? dynamicStyles.button : dynamicStyles.buttondark}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={dynamicStyles.buttonText}>{t("register_button")}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={dynamicStyles.loginButton} onPress={handleLoginNavigation}>
        <Text style={dynamicStyles.loginButtonText}>{t("have_account")}</Text>
      </TouchableOpacity>

      {snackbarMessage ? <Snackbar message={snackbarMessage} /> : null}
    </View>
  );
};

export default Register;
