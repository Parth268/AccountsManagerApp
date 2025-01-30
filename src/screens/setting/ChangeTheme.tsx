import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAppTheme } from "../../storage/context/ThemeContext"; // Ensure this is typed properly
import { t } from "i18next"; // Ensure i18n is properly configured
import { NavigationProp } from "@react-navigation/native";
import Header from "../../components/Header";

interface Props {
  navigation: NavigationProp<any>;
}

const ChangeThemeScreen: React.FC<Props> = ({ navigation }: Props) => {
  const { theme, toggleTheme } = useAppTheme(); // Get the theme and toggle function

  // Check if the background color is light or dark for comparison
  const currentTheme = theme === "light" ? "Light" : "Dark";

  const handleBackPress = () => {
    console.log("Back button pressed");
    // Add your navigation logic here
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme === "light" ? "#fff" : "#121212", // Use theme's background color
        },
      ]}
    >
      {/* Header Section */}
      <Header
        navigation={navigation}
        name={t("theme_change")}
        isHome={false}
        onBack={() => { }}
        rightIcon={
          (
            <></>
          )
        }
        phoneNumber={""}
      />

      {/* Main Content */}
      <ScrollView>
        <View style={styles.section}>
         
          <Pressable onPress={toggleTheme} style={styles.item}>
            <Icon
              name="notifications-none"
              size={24}
              color={theme === "light" ? "#444" : "#bbb"} // Icon color based on theme
              style={styles.icon}
            />
            <Text
              style={[
                styles.textPrimary,
                { color: theme === "light" ? "#000" : "#fff" }, // Text color based on theme
              ]}
            >
              {theme === "dark" ? t("light") : t("dark")} {/* Translating light/dark text */}
            </Text>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5", // Header color can be dynamic based on theme if needed
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
  },
  textSecondary: {
    fontSize: 14,
  },
});

export default ChangeThemeScreen;
