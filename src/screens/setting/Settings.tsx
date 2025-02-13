import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAppTheme } from "../../storage/context/ThemeContext";
import Header from "../../components/Header";
import PushNotification from "react-native-push-notification";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../storage/context/AuthContext";
import { DEFAULTS, NAVIGATION } from "../../utils/constants";
import { useLanguage } from "../../storage/context/LanguageContext";
import CustomAlert from "../../components/CustomAlert";
import { Snackbar } from "../../components/Snackbar";
import { useApp } from "../../storage/context/AppContext";

interface SettingsProps {
  navigation: any;
}



const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { language } = useLanguage();
    const { business, changeBusinessName } = useApp();
  
  const { theme, toggleTheme, toggleThemeStatus, themeProperties, themeStatus } = useAppTheme();
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const iconColor = theme === "light" ? "#333" : "#fff";

  const triggerSnackbar = (textData: string = "") => {
    setSnackbarMessage(textData);
    setTimeout(() => setSnackbarMessage(""), 2000);
  };

  const showAlert = () => setAlertVisible(true);
  const hideAlert = () => setAlertVisible(false);

  const logoutApp = () => {
    hideAlert();
    changeBusinessName("")
    logout();
  };

  const handleThemeChange = () => {
    if (!themeStatus) {
      toggleTheme()
    } else {
      triggerSnackbar(t("auto_dark_mode_on"));
    }
  }

  const handleNavigation = (url: string = "") => {
    navigation.navigate(NAVIGATION.WEBVIEW, { url });
  };

  const handleOnchangePassword = () => {
    navigation.navigate(NAVIGATION.CHANGE_PASSWORD);
  }

  const handleOnNotificationReset = () => {
    PushNotification.cancelAllLocalNotifications();
    PushNotification.removeAllDeliveredNotifications();
    triggerSnackbar(t("notification_clean"));
  };

  return (
    <View style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}>
      <Header
        navigation={navigation}
        name={t("settings")}
        isHome={false}
        onBack={() => { }}
        rightIcon={<></>}
        phoneNumber={""}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionHeader, { color: themeProperties.textColor }]}>
          {t("accessibility")}
        </Text>

        {/* <Pressable style={styles.item}
                  onPress={() => navigation.navigate(NAVIGATION.CHANGE_TEXT_SIZE)}>
          <Icon name="format-size" size={24} color={themeProperties.textColor} style={styles.icon} />
          <Text style={[styles.itemText, { color: themeProperties.textColor }]}>{t("increase_text_size")}</Text>
          <>
            <Icon name="arrow-forward" size={24} color={iconColor} />
          </>
        </Pressable> */}

        <Pressable style={styles.item}
          onPress={() => navigation.navigate(NAVIGATION.CHANGE_LANGUAGE)}>
          <Icon name="language" size={24}
            color={themeProperties.textColor} style={styles.icon} />
          <Text style={[styles.itemText, { color: themeProperties.textColor }]}>{t("language")}</Text>

          {/* <Text style={styles.itemSubText}>{language}</Text> */}

        </Pressable>

        <Pressable style={styles.item} onPress={handleOnNotificationReset}>
          <Icon name="notifications-none" size={24} color={themeProperties.textColor} style={styles.icon} />
          <Text style={[styles.itemText, { color: themeProperties.textColor }]}>
            {t("notifications_reset")}
          </Text>
        </Pressable>

        <Pressable style={styles.item} onPress={handleOnchangePassword}>
          <Icon name="password" size={24} color={themeProperties.textColor} style={styles.icon} />
          <Text style={[styles.itemText, { color: themeProperties.textColor }]}>
            {t("change_password")}
          </Text>
        </Pressable>

        <Text style={[styles.sectionHeader, { color: themeProperties.textColor }]}>{t("dark_mode")}</Text>
        <Pressable style={styles.item}
          onPress={() => navigation.navigate(NAVIGATION.MODE_STATUS)}>
          <Icon name={theme === "dark" ? "light-mode" : "dark-mode"} size={24}
            color={themeProperties.textColor} style={styles.icon} />
          <Text style={[styles.itemText, { color: themeProperties.textColor }]}>{t("auto_dark_mode")}</Text>
          <Text style={styles.itemSubText}>{themeStatus ? t("follow_os_setting") : t("off")}</Text>
        </Pressable>

        <Pressable style={[styles.item, {

        }]} onPress={handleThemeChange}>
          <Icon name="brightness-4" size={24} color={!themeStatus ? themeProperties.textColor : "lightgray"} style={styles.icon} />
          <Text style={[styles.itemText, { color: !themeStatus ? themeProperties.textColor : "lightgray" }]}>{t("dark_mode")}</Text>
          <Switch value={theme === "dark"} onValueChange={handleThemeChange} />
        </Pressable>

        <Text style={[styles.sectionHeader, { color: themeProperties.textColor }]}>{t("about")}</Text>
        <Pressable onPress={() => handleNavigation(DEFAULTS.POLICY_URL)} style={styles.item}>
          <Icon name="privacy-tip" size={24} color={themeProperties.textColor} style={styles.icon} />
          <Text style={[styles.itemText, { color: themeProperties.textColor }]}>{t("privacy_policy")}</Text>
        </Pressable>

        <Pressable style={styles.item} onPress={() => handleNavigation(DEFAULTS.TERM_AND_CONDITION)}>
          <Icon name="description" size={24} color={themeProperties.textColor} style={styles.icon} />
          <Text style={[styles.itemText, { color: themeProperties.textColor }]}>{t("terms_conditions")}</Text>
        </Pressable>

        <Pressable style={styles.item} onPress={showAlert}>
          <Icon name="logout" size={24} color="red" style={styles.icon} />
          <Text style={[styles.itemText, { color: "red" }]}>{t("logout")}</Text>
        </Pressable>


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

  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  icon: {
    marginRight: 15,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  itemSubText: {
    color: "gray",
    fontSize: 14,
  },
});

export default Settings;
