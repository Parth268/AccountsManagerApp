import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Importing Material Icons
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NAVIGATION, STORAGE_KEYS } from "../../utils/constants"; // Update path as per your project structure

const { width } = Dimensions.get("window");

const Dashboard = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("transaction");
  const [phoneNumber, setPhoneNumber] = useState(""); // State for phone number
  const tabIndicator = new Animated.Value(activeTab === "transaction" ? 0 : 1);

  // Fetch phone number from AsyncStorage on component mount
  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const storedNumber = await AsyncStorage.getItem(STORAGE_KEYS.USER_PHONE_NUMBER);
        if (storedNumber) {
          setPhoneNumber(storedNumber);
        } else {
          setPhoneNumber("Not Available");
        }
      } catch (error) {
        console.error("Failed to load phone number:", error);
      }
    };

    fetchPhoneNumber();
  }, []);

  const switchTab = (tab) => {
    setActiveTab(tab);
    Animated.spring(tabIndicator, {
      toValue: tab === "transaction" ? 0 : 1,
      useNativeDriver: false,
    }).start();
  };

  const tabIndicatorTranslateX = tabIndicator.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width / 2],
  });

  return (
    <View style={styles.container}>
      {/* Enhanced Header with Settings Icon */}
      <View style={styles.header}>
        <View>
          <Text style={styles.businessName}>Your Business Name</Text>
          <Text style={styles.ownerName}>{phoneNumber}</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => navigation.navigate(NAVIGATION.SETTING)} // Navigate to Settings
        >
          <Icon name="settings" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Animated.View
          style={[
            styles.tabIndicator,
            { transform: [{ translateX: tabIndicatorTranslateX }] },
          ]}
        />
        <TouchableOpacity
          style={styles.tab}
          onPress={() => switchTab("transaction")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "transaction" && styles.activeTabText,
            ]}
          >
            Transaction Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab} onPress={() => switchTab("party")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "party" && styles.activeTabText,
            ]}
          >
            Party Details
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {activeTab === "transaction" && (
          <View>
            <Text style={styles.heading}>Transaction Details</Text>
            <Text style={styles.description}>
              Manage all your transaction details efficiently.
            </Text>
          </View>
        )}
        {activeTab === "party" && (
          <View>
            <Text style={styles.heading}>Party Details</Text>
            <Text style={styles.description}>
              View and manage your party details here.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  businessName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  ownerName: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  settingsIcon: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 25,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
  },
  tabIndicator: {
    position: "absolute",
    height: "100%",
    width: "50%",
    backgroundColor: "#007bff",
    borderRadius: 25,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    zIndex: 1,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6c757d",
  },
  activeTabText: {
    color: "#ffffff",
    fontWeight: "bold",
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
