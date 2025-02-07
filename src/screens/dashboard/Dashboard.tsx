import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  RefreshControl,
  FlatList, // Use FlatList here
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NAVIGATION, STORAGE_KEYS } from "../../utils/constants";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../../storage/context/ThemeContext";
import CustomAlert from "../../components/CustomAlert";
import { Snackbar } from "../../components/Snackbar";
import HorizontalLine from "../../components/HorizontalLine";
import CustomerList from "../customer/CustomerList";
import Supplier from "../supplier/Supplier";
const { width } = Dimensions.get("window");

interface DashboardProps {
  navigation: any;
}

interface Transaction {
  id: string;
  phoneNumber: string;
  type: "receive" | "send";
  amount: number;
  name: string;
  imageurl: string;
  email: string;
  timestamp: string;
  userType: "customer" | "supplier";
  transationId: string;
  userId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { themeProperties } = useAppTheme();
  const [activeTab, setActiveTab] = useState<string>("customer");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [isRefreshing, setRefreshing] = useState(false);
  const [transation, setTransation] = useState<Transaction[]>([
    {
      "id": "6",
      "userId": "2d4f5gt",
      "phoneNumber": "9876543211",
      "type": "send",
      "amount": 3500,
      "name": "Sara Lee",
      "imageurl": "https://img.freepik.com/free-vector/minimal-invoice-template-vector-design_1017-12658.jpg",
      "email": "saralee@example.com",
      "timestamp": "2025-01-30T15:00:00Z",
      "transationId": "T1006",
      "userType": "customer",
    },
    {
      "id": "6",
      "userId": "2d4f5gt",
      "phoneNumber": "9876543211",
      "type": "send",
      "amount": 3500,
      "name": "Sara Lee",
      "imageurl": "https://img.freepik.com/free-vector/minimal-invoice-template-vector-design_1017-12658.jpg",
      "email": "saralee@example.com",
      "timestamp": "2025-01-30T15:00:00Z",
      "transationId": "T1006",
      "userType": "supplier",
    }
  ]);

  const [isAlertVisible, setAlertVisible] = useState(false);
  const { theme } = useAppTheme();

  const tabIndicator = new Animated.Value(activeTab === "customer" ? 0 : 1);

  useEffect(() => {
    fetchPhoneNumber();
  }, []);

  const fetchPhoneNumber = async () => {
    try {
      const storedNumber = await AsyncStorage.getItem(
        STORAGE_KEYS.USER_EMAIL
      );
      setPhoneNumber(storedNumber || "Not Available");
    } catch (error) {
      console.error("Failed to load phone number:", error);
    }
  };

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    Animated.spring(tabIndicator, {
      toValue: tab === "customer" ? 0 : 1,
      useNativeDriver: false,
    }).start();
  };

  const tabIndicatorTranslateX = tabIndicator.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width / 2],
  });

  const hideAlert = () => setAlertVisible(false);

  const triggerSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setTimeout(() => setSnackbarMessage(""), 2000);
  };

  const handlePress = () => {
    if (activeTab === "supplier") {
      navigation.navigate(NAVIGATION.ADD_EDIT_SUPPLIER);
    } else {
      navigation.navigate(NAVIGATION.ADD_EDIT_CUSTOMER);
    }
  }

  const logout = () => {
    hideAlert();
    triggerSnackbar(t("logout_success"));
    navigation.navigate(NAVIGATION.LOGIN);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPhoneNumber().finally(() => setRefreshing(false));
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeProperties.backgroundColor },
      ]}
    >
      <StatusBar
        backgroundColor={theme === "light" ? "#ffffff" : "#000000"}
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />

      <View style={styles.headercontainer}>
        <View>
          <Text style={styles.businessName}>{t('business')}</Text>
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
      <View
        style={[
          styles.tabContainer,
          { backgroundColor: theme === "light" ? "#ffffff" : "#808080" },
        ]}
      >
        <TouchableOpacity
          style={styles.tab}
          onPress={() => switchTab("customer")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "customer" && styles.activeTabText,
            ]}
          >
            {t("customer")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => switchTab("supplier")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "supplier" && styles.activeTabText,
            ]}
          >
            {t("supplier")}
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

      {/* Replace ScrollView with FlatList */}
      <FlatList
        data={transation}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return activeTab === "customer" && item.userType === "customer" ? (
            <CustomerList transation={[item]} navigation={navigation} />
          ) : activeTab === "supplier" && item.userType === "supplier" ? (
            <Supplier transation={[item]}  navigation={navigation} />
          ) : null;
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />


      <TouchableOpacity style={styles.fab} onPress={handlePress}>
        <Text style={styles.fabText}>{activeTab === "supplier" ? t('add_supplier') : t('add_customer')}</Text>
      </TouchableOpacity>

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
  fab: {
    position: 'absolute',
    bottom: 55,
    right: 18,
    backgroundColor: '#3c69ea',
    borderRadius: 25,
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
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
    paddingHorizontal: 2,
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
