import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import globalStyles from "../../styles/globalStyles";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../storage/context/AuthContext";
import CustomAlert from "../../components/CustomAlert";
import { DEFAULTS, NAVIGATION } from "../../utils/constants";
import PushNotification from "react-native-push-notification";
import { Snackbar } from "../../components/Snackbar";
import { NavigationProp } from "@react-navigation/native";
import Header from "../../components/Header";
import { useAppTheme } from "../../storage/context/ThemeContext"; // Import theme hook

interface Props {
  navigation: NavigationProp<any>;
}

const Settings: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { theme, toggleTheme, themeProperties } = useAppTheme(); // Access theme context
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const triggerSnackbar = (textData: string = "") => {
    setSnackbarMessage(textData);
    setTimeout(() => setSnackbarMessage(""), 2000); // Clear message after snackbar hides
  };

  const showAlert = () => setAlertVisible(true);
  const hideAlert = () => setAlertVisible(false);

  const logoutApp = () => {
    hideAlert();
    logout();
  };

  const handleNavigation = (url: string = "") => {
    navigation.navigate(NAVIGATION.WEBVIEW, { url });
  };

  const handleOnNotificationReset = () => {
    PushNotification.cancelAllLocalNotifications();
    PushNotification.removeAllDeliveredNotifications();
    triggerSnackbar(t("notification_clean"));
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeProperties.backgroundColor }, // Apply dynamic background color
      ]}
    >
      <Header
        navigation={navigation}
        name={t("settings")}
        isHome={false}
        onBack={() => {}}
        rightIcon={<></>}
        phoneNumber={""}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ACCOUNT INFORMATION Section */}
        <View style={styles.section}>
          <Pressable
            onPress={handleOnNotificationReset}
            style={({ pressed }) => [
              styles.item,
              { backgroundColor: pressed ? "#f0f0f0" : "transparent" },
            ]}
            accessibilityLabel={t("reset_notifications_label")}
          >
            <Icon name="notifications-none" size={24} color={themeProperties.textColor} style={styles.icon} />
            <Text style={[globalStyles.textPrimary, { color: themeProperties.textColor }]}>
              {t("notifications_reset")}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleNavigation(DEFAULTS.POLICY_URL)}
            style={styles.item}
            accessibilityLabel={t("privacy_policy")}
          >
            <Icon name="privacy-tip" size={24} color={themeProperties.textColor} style={styles.icon} />
            <Text style={[globalStyles.textPrimary, { color: themeProperties.textColor }]}>
              {t("privacy_policy")}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleNavigation(DEFAULTS.TERM_AND_CONDITION)}
            style={styles.item}
            accessibilityLabel={t("terms_and_conditions")}
          >
            <Icon name="lock-outline" size={24} color={themeProperties.textColor} style={styles.icon} />
            <Text style={[globalStyles.textPrimary, { color: themeProperties.textColor }]}>
              {t("term_and_condition")}
            </Text>
          </Pressable>

          <Pressable
            onPress={toggleTheme} // Toggle theme dynamically
            style={styles.item}
            accessibilityLabel={t("theme_change")}
          >
            <Icon name="color-lens" size={24} color={themeProperties.textColor} style={styles.icon} />
            <Text style={[globalStyles.textPrimary, { color: themeProperties.textColor }]}>
              {theme === "light" ? t("theme_change") : t("theme_change")}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate(NAVIGATION.CHANGE_LANGUAGE)}
            style={styles.item}
            accessibilityLabel={t("language_change")}
          >
            <Icon name="language" size={24} color={themeProperties.textColor} style={styles.icon} />
            <Text style={[globalStyles.textPrimary, { color: themeProperties.textColor }]}>
              {t("language_change")}
            </Text>
          </Pressable>

          <Pressable
            onPress={showAlert}
            style={[styles.item, styles.logoutItem]}
            accessibilityLabel={t("logout")}
          >
            <Icon name="logout" size={24} color="red" style={styles.icon} />
            <Text style={[globalStyles.errorText, styles.logoutText]}>{t("logout")}</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Custom Alert */}
      <CustomAlert
        visible={isAlertVisible}
        title={t("logout_confirmation")}
        message={t("logout_message")}
        onClose={hideAlert}
        onConfirm={logoutApp}
      />

      {/* Conditionally render Snackbar */}
      {snackbarMessage ? <Snackbar message={snackbarMessage} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  section: {
    flex: 1,
    marginHorizontal: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  icon: {
    marginRight: 15,
  },
  logoutItem: {},
  logoutText: {
    color: "red",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Settings;
