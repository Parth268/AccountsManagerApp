import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Pressable, // Use FlatList here
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NAVIGATION, STORAGE_KEYS } from "../../utils/constants";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../../storage/context/ThemeContext";
import CustomAlert from "../../components/CustomAlert";
import { Snackbar } from "../../components/Snackbar";
import HorizontalLine from "../../components/HorizontalLine";
import CustomerList from "../customer/CustomerList";
const { width } = Dimensions.get("window");
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from '@react-navigation/native';
import BusinessNameModal from "../../components/BusinessNameModal";
import { useApp } from "../../storage/context/AppContext";

interface DashboardProps {
  navigation: any;
}

interface User {
  id: string;
  phoneNumber: string;
  type: "receive" | "send";
  amount: number;
  name: string;
  email: string;
  timestamp: string;
  userType: "customer" | "supplier";
  createdAt: string;
  updatedAt: string;
  userId: string;
  transactions: Transaction[]; // Properly typed array of transactions
}


interface Transaction {
  id: string;
  userId: string;
  phoneNumber: string;
  type: 'receive' | 'send';
  amount: number;
  name: string;
  imageurl: string;
  email: string;
  timestamp: string;
  userType: 'customer' | 'supplier';
  transationId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { themeProperties } = useAppTheme();
  const { business, changeBusinessName } = useApp()
  const [activeTab, setActiveTab] = useState<string>("customer");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [businessName, setBusinessName] = useState(business)
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [isRefreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<User[]>([]);
  const [isBusiness, setIsBusiness] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const { theme } = useAppTheme();

  const tabIndicator = new Animated.Value(activeTab === "customer" ? 0 : 1);

  const fetchData = useCallback(() => {
    fetchPhoneNumber();
    loadBusinessName()
    fetchList().then((data) => {
      setUserData(data);
    });
  }, []); // Ensures fetchData remains stable

  useFocusEffect(fetchData); // Runs on screen focus

  useEffect(() => {
    fetchData(); // Runs on component mount
  }, [fetchData]);



  const loadBusinessName = async () => {
    setIsLoading(true);
    try {
      const user = auth().currentUser;
      if (!user) {
        setIsLoading(false);
        return;
      }

      const userId = user.uid;
      const userRef = database().ref(userId);

      const snapshot = await userRef.once("value");

      if (!snapshot.exists()) {
        setBusinessName("");
        setIsBusiness(true);
      } else {
        const rawData = snapshot.val();

        if (rawData.businessName) {
          setBusinessName(rawData.businessName);
        } else {
          setBusinessName("");
          setIsBusiness(true);
        }
      }
    } catch (error) {
      console.error("Error fetching business name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchList = async (): Promise<User[]> => {
    setIsLoading(true);

    try {
      const user = auth().currentUser;
      if (!user) {
        return [];
      }

      const userId = user.uid;
      const userRef = database().ref(userId);
      const snapshot = await userRef.once("value");

      if (!snapshot.exists()) {
        console.log("No data available");
        return [];
      }

      const rawData = snapshot.val() ?? {};
      const users: User[] = Object.entries(rawData)
        .map(([key, value]) => {
          const user = value as any; // Explicitly assert type
          return {
            id: user.id ?? "",
            phoneNumber: user.phoneNumber ?? "",
            type: ["receive", "send"].includes(user.type) ? user.type : "receive",
            amount: Number(user.amount) || 0,
            name: user.name ?? "",
            email: user.email ?? "",
            timestamp: user.timestamp ?? "",
            createdAt: user.createdAt ?? "",
            updatedAt: user.updatedAt ?? "",
            userType: ["customer", "supplier"].includes(user.userType) ? user.userType : "customer",
            userId: key,
            transactions: [],
          };
        })
        .filter(user => user.id && user.name);

      return users;
    } catch (error) {
      console.error("Error fetching list:", (error as Error).message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };



  const handleBusiness = async (data: string) => {
    setIsLoading(true);
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) {
        triggerSnackbar(t("authentication_failed"));
        return;
      }

      const userRef = database().ref(userId);

      // Save business name
      await userRef.set({ businessName: data, userId });

      // Success actions
      triggerSnackbar(t("data_added"));
      setBusinessName(data);
      changeBusinessName(data);
    } catch (error) {
      console.error("Failed to save business name:", error);
      triggerSnackbar(t("something_went_wrong"));
      setBusinessName("");
    } finally {
      setIsLoading(false);
    }
  };


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
      navigation.navigate(NAVIGATION.ADD_EDIT_CUSTOMER, { businessName: businessName });
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
        <Pressable onPress={() => { setIsBusiness(!isBusiness) }}>
          <View style={{
            flexDirection: 'row',
          
          }}>
            <Text style={styles.businessName}>{businessName}</Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 5,
              marginTop: 2,
            }}>
              <AntDesign name="down" size={16} color={themeProperties.textColor} />
            </View>
          </View>
          {phoneNumber && <Text style={styles.ownerName}>{phoneNumber}</Text>}
        </Pressable>

        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => navigation.navigate(NAVIGATION.SETTING)}
        >
          <Icon name="settings" size={24} color={themeProperties.textColor} />
        </TouchableOpacity>
      </View>

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

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={themeProperties.textColor} />
        </View>
      ) : (
        activeTab === "customer" ? (
          <CustomerList user={Array.isArray(userData) ? userData : [userData]}
            onRefreshList={fetchList}
            navigation={navigation} />
        ) : activeTab === "supplier" ? (
          <></>
        ) : null
      )}

      <TouchableOpacity style={styles.fab} onPress={handlePress}>
        <Text style={styles.fabText}>{activeTab === "supplier" ? t('add_supplier') : t('add_customer')}</Text>
      </TouchableOpacity>

      <CustomAlert
        visible={isAlertVisible}
        title={t("logout_confirmation")}
        message={t("logout_message")}
        onClose={hideAlert}
        onConfirm={logout}
      />

      <BusinessNameModal
        visible={isBusiness}
        title={t("enter_business_name")}
        onSave={(data) => {
          setBusinessName(data)
          setIsBusiness(!isBusiness)
          handleBusiness(data)
        }}
        inputValueData={businessName}
        onClose={() => {
          setIsBusiness(!isBusiness)
        }}
      />

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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
