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
import SupplierList from "../supplier/Supplier";

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
}

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { themeProperties } = useAppTheme();
  const [activeTab, setActiveTab] = useState<string>("customer");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [isRefreshing, setRefreshing] = useState(false);
  const [transation, setTransation] = useState<Transaction[]>(
    [
      {
        "id": "6",
        "phoneNumber": "9876543211",
        "type": "send",
        "amount": 3500,
        "name": "Sara Lee",
        "imageurl": "https://img.freepik.com/free-vector/minimal-invoice-template-vector-design_1017-12658.jpg",
        "email": "saralee@example.com",
        "timestamp": "2025-01-30T15:00:00Z",
        "transationId": "T1006",
        "userType": "supplier"
      },
      {
        "id": "7",
        "phoneNumber": "9234567890",
        "type": "receive",
        "amount": 4500,
        "name": "David Harris",
        "imageurl": "https://img.freepik.com/free-vector/minimal-invoice-template-vector-design_1017-12658.jpg",
        "email": "davidharris@example.com",
        "timestamp": "2025-01-30T16:00:00Z",
        "transationId": "T1007",
        "userType": "customer"
      },
      {
        "id": "8",
        "phoneNumber": "9678543210",
        "type": "send",
        "amount": 3000,
        "name": "Emily Davis",
        "imageurl": "https://img.freepik.com/free-vector/minimal-invoice-template-vector-design_1017-12658.jpg",
        "email": "emilydavis@example.com",
        "timestamp": "2025-01-30T17:00:00Z",
        "transationId": "T1008",
        "userType": "customer"
      },
      {
        "id": "9",
        "phoneNumber": "9765432109",
        "type": "receive",
        "amount": 2800,
        "name": "Chris Wilson",
        "imageurl": "https://img.freepik.com/free-vector/minimal-invoice-template-vector-design_1017-12658.jpg",
        "email": "chriswilson@example.com",
        "timestamp": "2025-01-30T18:00:00Z",
        "transationId": "T1009",
        "userType": "supplier"
      },
      {
        "id": "10",
        "phoneNumber": "9801234567",
        "type": "send",
        "amount": 1800,
        "name": "Natalie Green",
        "imageurl": "https://img.freepik.com/free-vector/minimal-invoice-template-vector-design_1017-12658.jpg",
        "email": "nataliegreen@example.com",
        "timestamp": "2025-01-30T19:00:00Z",
        "transationId": "T1010",
        "userType": "customer"
      },
      {
        "id": "11",
        "phoneNumber": "9123456780",
        "type": "receive",
        "amount": 5300,
        "name": "Liam Brown",
        "imageurl": "https://img.freepik.com/free-vector/minimal-invoice-template-vector-design_1017-12658.jpg",
        "email": "liambrown@example.com",
        "timestamp": "2025-01-30T20:00:00Z",
        "transationId": "T1011",
        "userType": "supplier"
      },
      {
        "id": "12",
        "phoneNumber": "9234567892",
        "type": "send",
        "amount": 2200,
        "name": "Sophia Miller",
        "imageurl": "https://img.freepik.com/free-vector/minimal-invoice-template-vector-design_1017-12658.jpg",
        "email": "sophiamiller@example.com",
        "timestamp": "2025-01-30T21:00:00Z",
        "transationId": "T1012",
        "userType": "customer"
      },
      {
        "id": "13",
        "phoneNumber": "9345678901",
        "type": "receive",
        "amount": 3800,
        "name": "Ethan Clark",
        "imageurl": "https://img.freepik.com/free-vector/minimal-invoice-template-vector-design_1017-12658.jpg",
        "email": "ethanclark@example.com",
        "timestamp": "2025-01-30T22:00:00Z",
        "transationId": "T1013",
        "userType": "supplier"
      },
      {
        "id": "14",
        "phoneNumber": "9456789012",
        "type": "send",
        "amount": 5000,
        "name": "Mia Roberts",
        "imageurl": "https://img.freepik.com/free-vector/minimal-invoice-template-vector-design_1017-12658.jpg",
        "email": "miaroberts@example.com",
        "timestamp": "2025-01-30T23:00:00Z",
        "transationId": "T1014",
        "userType": "customer"
      },
      {
        "id": "15",
        "phoneNumber": "9567890123",
        "type": "receive",
        "amount": 4100,
        "name": "Oliver White",
        "imageurl": "https://img.freepik.com/free-vector/minimal-invoice-template-vector-design_1017-12658.jpg",
        "email": "oliverwhite@example.com",
        "timestamp": "2025-01-31T00:00:00Z",
        "transationId": "T1015",
        "userType": "supplier"
      },
      
    ]
  );

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

  const showAlert = () => setAlertVisible(true);
  const hideAlert = () => setAlertVisible(false);

  const triggerSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setTimeout(() => setSnackbarMessage(""), 2000);
  };

  const handlePress = () => {

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
            <CustomerList transation={[item]} />
          ) : activeTab === "supplier" && item.userType === "supplier" ? (
            <SupplierList transation={[item]} />
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
