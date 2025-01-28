import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import globalStyles from "../../styles/globalStyles";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../storage/context/AuthContext";
import CustomAlert from "../../components/CustomAlert";

const SettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const [isAlertVisible, setAlertVisible] = useState(false);

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

  const handleOnLanguageChange = () => {

  }

  const handleOnThemeChange = () => {
  }
  const handleOnNotificationReset = () => {
  }

  const handleOnPrivacyPolicy = () => {

  }

  const handleOnTermsOfService = () => {
  }

  const handlePasswordChange = () => {
    
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
          <Pressable onPress={handlePasswordChange} style={styles.item}>
            <Icon name="lock-outline" size={24} color="#444" style={styles.icon} />
            <Text style={globalStyles.textPrimary}>{t("security_logins")}</Text>
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
