import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NAVIGATION, STORAGE_KEYS } from "../../utils/constants";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../../storage/context/ThemeContext";
import CustomAlert from "../../components/CustomAlert"; // For confirmation dialogs
import { Snackbar } from "../../components/Snackbar";
import HorizontalLine from "../../components/HorizontalLine";

const { width } = Dimensions.get("window");

interface DashboardProps {
  navigation: any;
}

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { themeProperties } = useAppTheme();
  const [activeTab, setActiveTab] = useState<string>("transaction");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const [isAlertVisible, setAlertVisible] = useState(false);
  const { theme } = useAppTheme();

  const tabIndicator = new Animated.Value(activeTab === "transaction" ? 0 : 1);

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const storedNumber = await AsyncStorage.getItem(
          STORAGE_KEYS.USER_PHONE_NUMBER
        );
        setPhoneNumber(storedNumber || "Not Available");
      } catch (error) {
        console.error("Failed to load phone number:", error);
      }
    };

    fetchPhoneNumber();
  }, []);

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    Animated.spring(tabIndicator, {
      toValue: tab === "transaction" ? 0 : 1,
      useNativeDriver: false,
    }).start();
  };

  const tabIndicatorTranslateX = tabIndicator.interpolate({
    inputRange: [0, 1],
    outputRange: [0,  (width / 2)],
  });

  const showAlert = () => setAlertVisible(true);
  const hideAlert = () => setAlertVisible(false);

  const triggerSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setTimeout(() => setSnackbarMessage(""), 2000);
  };

  const logout = () => {
    hideAlert();
    triggerSnackbar(t("logout_success"));
    navigation.navigate(NAVIGATION.LOGIN);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}
    >
      <StatusBar
        backgroundColor={theme === "light" ? "#ffffff" : "#000000"}
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />

      <View style={styles.headercontainer}>
        <View>
          <Text style={styles.businessName}>{"Business"}</Text>
          {phoneNumber && <Text style={styles.ownerName}>{phoneNumber}</Text>}
        </View>

        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => navigation.navigate(NAVIGATION.SETTING)}
        >
          <Icon name="settings" size={24} color={themeProperties.textColor} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => switchTab("transaction")}
        >
          <Text
            style={[
              styles.tabText,
              styles.activeTabText,
            ]}
          >
            {t("transaction_details")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => switchTab("party")}
        >
          <Text
            style={[
              styles.tabText,
              styles.activeTabText,
            ]}
          >
            {t("party_details")}
          </Text>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.tabIndicator,
            { transform: [{ translateX: tabIndicatorTranslateX }] },
          ]}
        />
      </View>



      <HorizontalLine />

      {/* Tab Content */}
      <ScrollView style={styles.contentContainer}>
        {activeTab === "transaction" && (
          <View>
            <Text style={styles.heading}>{t("transaction_details")}</Text>
            <Text style={styles.description}>
              {t("manage_transaction_details")}
            </Text>
          </View>
        )}
        {activeTab === "party" && (
          <View>
            <Text style={styles.heading}>{t("party_details")}</Text>
            <Text style={styles.description}>{t("manage_party_details")}</Text>
          </View>
        )}
      </ScrollView>

      {/* Custom Alert */}
      <CustomAlert
        visible={isAlertVisible}
        title={t("logout_confirmation")}
        message={t("logout_message")}
        onClose={hideAlert}
        onConfirm={logout}
      />

      {/* Snackbar */}
      {snackbarMessage ? <Snackbar message={snackbarMessage} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headercontainer: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  businessName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
  },
  ownerName: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  settingsIcon: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    fontWeight: "bold",
  },
  tabIndicator: {
    height: 3,
    width: width / 2.4,
    backgroundColor: "#007bff",
    borderRadius: 3,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  contentContainer: {
    flex: 1,
    marginTop: 24,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
    lineHeight: 22,
  },
});

export default Dashboard;
