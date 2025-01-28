import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import globalStyles from "../../styles/globalStyles";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../storage/context/AuthContext";
import CustomAlert from "../../components/CustomAlert";
import { DEFAULTS, NAVIGATION } from "../../utils/constants";
import PushNotification from 'react-native-push-notification';

const SettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const [isAlertVisible, setAlertVisible] = useState(false);

  // Handle back navigation
  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    } else {
      console.warn("No navigation prop available");
    }
  };

  // Show alert for logout confirmation
  const showAlert = () => setAlertVisible(true);
  const hideAlert = () => setAlertVisible(false);



  // Logout user
  const logoutApp = () => {
    hideAlert();
    logout();
  };


  // Handle language change
  const handleOnLanguageChange = () => {
    // Implement language change logic here
    navigation.navigate(NAVIGATION.CHANGE_LANGUAGE)
  }

  // Handle theme change
  const handleOnThemeChange = () => {
    // Implement theme change logic here
    navigation.navigate(NAVIGATION.CHANGE_THEME)

  }

  // Reset notifications
  const handleOnNotificationReset = () => {
    // Implement notification reset logic here
    PushNotification.cancelAllLocalNotifications();

    // To clear any scheduled notifications (if applicable)
    PushNotification.removeAllDeliveredNotifications();
  }

  // Handle privacy policy
  const handleOnPrivacyPolicy = () => {
    // Navigate to privacy policy screen or show details
    navigation.navigate(NAVIGATION.WEBVIEW, { url: DEFAULTS.POLICY_URL })
  }

  // Handle terms of service
  const handleOnTermsOfService = () => {
    // Navigate to terms of service screen or show details
    navigation.navigate(NAVIGATION.WEBVIEW, { url: DEFAULTS.TERM_AND_CONDITION })

  }



  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text style={[globalStyles.textPrimary, styles.title]}>{t("settings")}</Text>
      </View>

      <ScrollView>
        {/* ACCOUNT INFORMATION Section */}
        <View style={styles.section}>
          <Text style={[globalStyles.textSecondary, styles.sectionTitle]}>{t("account_information")}</Text>

          <Pressable onPress={handleOnNotificationReset} style={styles.item}>
            <Icon name="notifications-none" size={24} color="#444" style={styles.icon} />
            <Text style={globalStyles.textPrimary}>{t("notifications_reset")}</Text>
          </Pressable>
          <Pressable onPress={handleOnPrivacyPolicy} style={styles.item}>
            <Icon name="privacy-tip" size={24} color="#444" style={styles.icon} />
            <Text style={globalStyles.textPrimary}>{t("privacy_policy")}</Text>
          </Pressable>
          <Pressable onPress={handleOnTermsOfService} style={styles.item}>
            <Icon name="lock-outline" size={24} color="#444" style={styles.icon} />
            <Text style={globalStyles.textPrimary}>{t("term_and_condition")}</Text>
          </Pressable>
          <Pressable onPress={handleOnThemeChange} style={styles.item}>
            <Icon name="color-lens" size={24} color={"#444"} style={styles.icon} />
            <Text style={globalStyles.textPrimary}>{t("theme_change")}</Text>
          </Pressable>
          <Pressable onPress={handleOnLanguageChange} style={styles.item}>
            <Icon name="lock-outline" size={24} color="#444" style={styles.icon} />
            <Text style={globalStyles.textPrimary}>{t("language_change")}</Text>
          </Pressable>
        </View>

        {/* ACTIONS Section */}
        <View style={styles.section}>
          <Text style={[globalStyles.textSecondary, styles.sectionTitle]}>{t("actions")}</Text>
          <Pressable onPress={showAlert} style={styles.logoutItem}>
            <Icon name="logout" size={24} color="red" style={styles.icon} />
            <Text style={globalStyles.errorText}>{t("logout")}</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Custom Alert */}
      <CustomAlert
        visible={isAlertVisible}
        title="Logout Confirmation"
        message="Are you sure you want to log out?"
        onClose={hideAlert}
        onConfirm={logoutApp}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  icon: {
    marginRight: 10,
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});


export default SettingsScreen;
