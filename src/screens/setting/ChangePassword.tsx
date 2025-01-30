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

interface ChangePasswordProps {
  navigation: NavigationProp<any>;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme, themeProperties } = useAppTheme();

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const triggerSnackbar = (message: string = "") => {
    setSnackbarMessage(message);
    setTimeout(() => setSnackbarMessage(""), 2000); // Clear message after 2 seconds
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      triggerSnackbar(t("error_message"));
      return;
    }

    if (newPassword.length < 6) {
      triggerSnackbar(t("password_required_length"));
      return;
    }

    if (newPassword !== confirmPassword) {
      triggerSnackbar(t("password_mismatch"));
      return;
    }

    setLoading(true);
    try {
      const user = auth().currentUser;
      if (!user || !user.email) throw new Error("User not authenticated");

      // Re-authenticate user
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await user.reauthenticateWithCredential(credential);

      // Update password
      await user.updatePassword(newPassword);
      setLoading(false);
      triggerSnackbar(t("password_updated"));
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
          {t("change_password")}
        </Text>
      </View>

      <TextInput
        style={dynamicStyles.input}
        placeholder={t("current_password_placeholder")}
        secureTextEntry
        value={currentPassword}
        onChangeText={(text: string) => setCurrentPassword(text)}
        placeholderTextColor="#AAAAAA"
      />
      <TextInput
        style={dynamicStyles.input}
        placeholder={t("new_password_placeholder")}
        secureTextEntry
        value={newPassword}
        onChangeText={(text: string) => setNewPassword(text)}
        placeholderTextColor="#AAAAAA"
      />
      <TextInput
        style={dynamicStyles.input}
        placeholder={t("confirm_password_placeholder")}
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text: string) => setConfirmPassword(text)}
        placeholderTextColor="#AAAAAA"
      />

      <TouchableOpacity
        style={theme === "light" ? dynamicStyles.button : dynamicStyles.buttonDark}
        onPress={handleChangePassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={dynamicStyles.buttonText}>{t("confirm")}</Text>
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

export default ChangePassword;
