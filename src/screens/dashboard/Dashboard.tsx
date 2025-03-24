import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert, BackHandler,
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
import Customer from "../customer/Customer";
const { width } = Dimensions.get("window");
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from '@react-navigation/native';
import BusinessNameModal from "../../components/BusinessNameModal";
import { useApp } from "../../storage/context/AppContext";
import { User } from "../types";
import Supplier from "../supplier/Supplier";

type DashboardProps = {
  navigation: any;
}


const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {

  const { t } = useTranslation();
  const { themeProperties, theme } = useAppTheme();
  const { business, changeBusinessName } = useApp();
  const [activeTab, setActiveTab] = useState<string>("customer");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [businessName, setBusinessName] = useState(business);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [isRefreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false)

  const tabIndicator = useRef(new Animated.Value(activeTab === "customer" ? 0 : 1)).current;

  const fetchData = useCallback(() => {
    (async () => {
      await Promise.all([fetchPhoneNumber(), loadBusinessName(), fetchList()]);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useFocusEffect(
    useCallback(() => {

      const backAction = () => {
        Alert.alert(
          t("exit_app"),
          t("exit_title"),
          [
            { text: t('cancel'), onPress: () => null, style: 'cancel' },
            { text: t('yes'), onPress: () => BackHandler.exitApp() },
          ]
        );
        return true; // Prevent default back action
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
  
      return () => backHandler.remove(); // Cleanup on unmount

    }, [])
  );

  


  const loadBusinessName = async () => {
    try {
      setIsLoading(true);
      const user = auth().currentUser;
      if (!user) return;

      const snapshot = await database().ref(user.uid).once("value");
      const rawData = snapshot.val();
      if (rawData?.businessName) {
        setBusinessName(rawData?.businessName);
      } else {
        setIsBusiness(true)
      }
    } catch (error) {
      console.error("Error fetching business name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchList = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const user = auth().currentUser;
      if (!user) return;

      const snapshot = await database().ref(user.uid).once("value");
      if (!snapshot.exists()) return;

      const users = Object.entries(snapshot.val() || {})
        .map(([key, value]) => {
          const user = value as any;
          return {
            id: user.id ?? "",
            phoneNumber: user.phoneNumber ?? "",
            type: ["receive", "send"].includes(user.type) ? user.type : "receive",
            amount: Number(user.amount) || 0,
            name: user.name ?? "",
            address: user.address ?? "",
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

      setUserData(users);
    } catch (error) {
      console.error("Error fetching list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusiness = async (data: string) => {
    try {
      setIsLoading(true);
      const userId = auth().currentUser?.uid;
      if (!userId) return triggerSnackbar(t("authentication_failed"));

      // await database().ref(userId).set({
      //   businessName: data,
      //   userId
      // });

      const userRef = database().ref(`${userId}`);

      // Append to array or initialize if empty
      await userRef.update({
        businessName: data,
        userId: userId,
      });

      setBusinessName(data);
      changeBusinessName(data);
      triggerSnackbar(t("data_added"));
    } catch (error) {
      console.error("Failed to save business name:", error);
      setBusinessName("");
      triggerSnackbar(t("something_went_wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPhoneNumber = async () => {
    try {
      const storedNumber = await AsyncStorage.getItem(STORAGE_KEYS.USER_EMAIL);
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

  const triggerSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setTimeout(() => setSnackbarMessage(""), 2000);
  };

  const handlePress = () => {
    if (businessName) {
      navigation.navigate(
        activeTab === "supplier" ? NAVIGATION.ADD_EDIT_SUPPLIER : NAVIGATION.ADD_EDIT_CUSTOMER,
        { businessName }
      );
    } else {
      setIsBusiness(true)
    }
  };

  const logout = () => {
    setAlertVisible(false);
    triggerSnackbar(t("logout_success"));
    navigation.navigate(NAVIGATION.LOGIN);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

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
        {businessName &&
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

            {phoneNumber && <Text style={[styles.ownerName,{
                  color: themeProperties.textColor
            }]}>{phoneNumber}</Text>}
          </Pressable>
        }

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
              styles.tabText, { color: themeProperties.textColor },
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
              styles.tabText, { color: themeProperties.textColor },
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

      {isLoading || isRefreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={themeProperties.textColor} />
        </View>
      ) : (
        activeTab === "customer" ? (
          <Customer user={Array.isArray(userData) ? userData : [userData]}
            onRefreshList={() => onRefresh}
            navigation={navigation} />
        ) : activeTab === "supplier" ? (
          <Supplier user={Array.isArray(userData) ? userData : [userData]}
            onRefreshList={() => onRefresh}
            navigation={navigation} />
        ) : null
      )}

      <TouchableOpacity style={styles.fab} onPress={handlePress}>
        <Text style={styles.fabText}>{activeTab === "supplier" ? t('add_supplier') : t('add_customer')}</Text>
      </TouchableOpacity>

      <CustomAlert
        visible={isAlertVisible}
        title={t("logout_confirmation")}
        message={t("logout_message")}
        onClose={() => { setAlertVisible(false) }}
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
