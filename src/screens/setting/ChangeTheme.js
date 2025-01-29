import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useColorScheme,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Ensure this package is installed
import { useTheme } from "../../storage/context/ThemeContext"; // Ensure useTheme is properly typed
import { t } from "i18next"; // Ensure i18n is properly configured



const ChangeThemeScreen  = () => {
  const { theme, toggleTheme } = useTheme(); // Add proper types in ThemeContext
  const systemTheme = useColorScheme(); // Fetch system theme (light or dark)

  const currentTheme = theme === "light" ? "Light" : "Dark";

  const handleBackPress = () => {
    console.log("Back button pressed");
    // Add your navigation logic here
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Pressable onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text style={[styles.textPrimary, styles.title]}>{t("theme_change")}</Text>
      </View>

      {/* Main Content */}
      <ScrollView>
        {/* Account Information Section */}
        <View style={styles.section}>
          <Text style={[styles.textSecondary, styles.sectionTitle]}>
            {t("account_information")}
          </Text>

          <Pressable onPress={toggleTheme} style={styles.item}>
            <Icon
              name="notifications-none"
              size={24}
              color="#444"
              style={styles.icon}
            />
            <Text style={styles.textPrimary}>{t("notifications_reset")}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Change based on theme if required
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  icon: {
    marginRight: 16,
  },
  textPrimary: {
    fontSize: 16,
    color: "#000",
  },
  textSecondary: {
    fontSize: 14,
    color: "#666",
  },
});

export default ChangeThemeScreen;
