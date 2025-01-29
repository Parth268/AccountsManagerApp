import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import globalStyles from "../../styles/globalStyles";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../storage/context/AuthContext";
import CustomAlert from "../../components/CustomAlert";
import { DEFAULTS, NAVIGATION } from "../../utils/constants";
import PushNotification from "react-native-push-notification";
import { Snackbar } from "../../components/Snackbar";
import { NavigationProp } from "@react-navigation/native";

interface Props {
  navigation: NavigationProp<any>;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const triggerSnackbar = (textData: string = "") => {
    setSnackbarMessage(textData);
    setTimeout(() => setSnackbarMessage(''), 3500); // Clear message after snackbar hides
  };

  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    } else {
      console.warn("No navigation prop available");
    }
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
    triggerSnackbar("Notification Clean")
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBackPress} style={styles.backButton} accessibilityLabel={t("back")}>
          <Icon name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text style={[globalStyles.textPrimary, styles.title]}>{t("settings")}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ACCOUNT INFORMATION Section */}
        <View style={styles.section}>
          <Text style={[globalStyles.textSecondary, styles.sectionTitle]}>
            {t("account_information")}
          </Text>

          <Pressable
            onPress={handleOnNotificationReset}
            style={({ pressed }) => [styles.item, { backgroundColor: pressed ? "#f0f0f0" : "transparent" }]}
            accessibilityLabel={t("reset_notifications_label")}
          >
            <Icon name="notifications-none" size={24} color="#444" style={styles.icon} />
            <Text style={globalStyles.textPrimary}>{t("notifications_reset")}</Text>
          </Pressable>
          <Pressable
            onPress={() => handleNavigation(DEFAULTS.POLICY_URL)}
            style={styles.item}
            accessibilityLabel={t("privacy_policy")}
          >
            <Icon name="privacy-tip" size={24} color="#444" style={styles.icon} />
            <Text style={globalStyles.textPrimary}>{t("privacy_policy")}</Text>
          </Pressable>
          <Pressable
            onPress={() => handleNavigation(DEFAULTS.TERM_AND_CONDITION)}
            style={styles.item}
            accessibilityLabel={t("terms_and_conditions")}
          >
            <Icon name="lock-outline" size={24} color="#444" style={styles.icon} />
            <Text style={globalStyles.textPrimary}>{t("term_and_condition")}</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate(NAVIGATION.CHANGE_THEME)}
            style={styles.item}
            accessibilityLabel={t("theme_change")}
          >
            <Icon name="color-lens" size={24} color={"#444"} style={styles.icon} />
            <Text style={globalStyles.textPrimary}>{t("theme_change")}</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate(NAVIGATION.CHANGE_LANGUAGE)}
            style={styles.item}
            accessibilityLabel={t("language_change")}
          >
            <Icon name="language" size={24} color="#444" style={styles.icon} />
            <Text style={globalStyles.textPrimary}>{t("language_change")}</Text>
          </Pressable>
        </View>

        {/* ACTIONS Section */}
        <View style={styles.section}>
          <Text style={[globalStyles.textSecondary, styles.sectionTitle]}>
            {t("actions")}
          </Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  icon: {
    marginRight: 15,
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  logoutText: {
    color: "red",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SettingsScreen;
