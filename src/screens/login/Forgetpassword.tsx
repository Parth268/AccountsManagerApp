import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { useTranslation } from "react-i18next";
import { NavigationProp } from "@react-navigation/native";
import { Snackbar } from "../../components/Snackbar";
import { useAppTheme } from "../../storage/context/ThemeContext";

interface ForgetPasswordProps {
  navigation: NavigationProp<any>;
}

const ForgetPassword: React.FC<ForgetPasswordProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme, themeProperties } = useAppTheme();

  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const triggerSnackbar = (message: string = "") => {
    setSnackbarMessage(message);
    setTimeout(() => setSnackbarMessage(""), 2000); // Clear message after 2 seconds
  };

  const handleResetPassword = async () => {
    if (!email) {
      triggerSnackbar(t("email_required"));
      return;
    }
    setLoading(true);
    try {
      await auth().sendPasswordResetEmail(email);
      setLoading(false);
      triggerSnackbar(t("reset_email_sent"));
      setTimeout(() => navigation.goBack(), 1000);
    } catch (error) {
      setLoading(false);
      console.error(error);
      triggerSnackbar(t("reset_failed"));
    }
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
    buttonDark: {
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
    backButton: {
      marginTop: 25,
    },
    backButtonText: {
      color: themeProperties.textColor,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <View style={{ marginBottom: 30, alignItems: "center" }}>
        <Text style={[dynamicStyles.text, { fontSize: 28, fontWeight: "bold" }]}>
          {t("reset_password")}
        </Text>
        <Text style={[dynamicStyles.text, { fontSize: 16, marginTop: 5 }]}>
          {t("reset_description")}
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

      <TouchableOpacity
        style={theme === "light" ? dynamicStyles.button : dynamicStyles.buttonDark}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={dynamicStyles.buttonText}>{t("send_reset_link")}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={dynamicStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={dynamicStyles.backButtonText}>{t("go_back")}</Text>
      </TouchableOpacity>

      {snackbarMessage ? <Snackbar message={snackbarMessage} /> : null}
    </View>
  );
};

export default ForgetPassword;
