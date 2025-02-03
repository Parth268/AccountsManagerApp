import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useAppTheme } from "../../storage/context/ThemeContext";
import { useTranslation } from "react-i18next";
import database from '@react-native-firebase/database';
import CustomAlertUser from "../../components/CustomAlertUser";

interface Transaction {
  id: string;
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

interface Props {
  transation: Transaction[];
}

const CustomerList: React.FC<Props>  = ({ transation }: Props) => {
  const { t } = useTranslation();
  const { theme, themeProperties } = useAppTheme();
  const [customersTransation, setCustomersTransation] = useState<Transaction[]>(transation);
  const [refreshing, setRefreshing] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const confirmAction = () => {
    // Handle the confirm action
    console.log("User confirmed the action!");
    setAlertVisible(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate fetch action (replace with your data fetch logic)
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  }, []);

  const handlePress = () => {

  }

  const handleCall = () => {
    setAlertVisible(!alertVisible)
  }

  // Render each customer item
  const renderCustomerItem = ({ item }: { item: Transaction }) => {
    const transactionTimestamp = item?.timestamp
      ? new Date(item?.timestamp)
      : new Date();

    const formattedTimestamp = transactionTimestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const isDarkMode = theme === 'dark';

    return (
      item?.userType === 'customer' && (
        <View style={[styles.customerCard, { backgroundColor: isDarkMode ? '#333' : '#ffffff' }]}>
          <View style={styles.imageContainer}>
            <Text style={styles.initialText}>{item?.name.charAt(0).toUpperCase()}</Text>
          </View>

          <View style={styles.customerInfo}>
            <Text style={[styles.customerName, { color: isDarkMode ? '#fff' : '#333' }]}>{item?.name}</Text>

            <View style={styles.customerDetails}>
              <Pressable onPress={handleCall} style={styles.detailItem}>
                <Text style={[styles.icon, { color: isDarkMode ? '#00bfff' : '#007bff' }]}>📞</Text>
                <Text style={[styles.customerPhone, { color: isDarkMode ? '#bbb' : '#666' }]}>{item?.phoneNumber}</Text>
              </Pressable>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            {/* Conditional background color */}
            <View style={[styles.sendMoneyStatus, {
              backgroundColor: item?.type === 'send' ? '#cb4750' : '#8BC34A'
            }]} >
              {
                item?.type === 'send' ? (
                  <Text style={styles.sendMoneyText}>{item?.amount}</Text>
                ) : (
                  <Text style={styles.sendMoneyText}>{item?.amount}</Text>
                )
              }
            </View>

            {/* Timestamp */}
            <View style={styles.timestampContainer}>
              <Text style={[styles.timestampText, { color: isDarkMode ? '#bbb' : '#777' }]}>{formattedTimestamp}</Text>
            </View>
          </View>
        </View>
      ) || null // Returns null if userType is not 'customer'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}>
      <FlatList
        data={customersTransation}
        keyExtractor={(item) => item?.email} // or item.name, if you prefer a unique identifier
        renderItem={renderCustomerItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <CustomAlertUser
        visible={alertVisible}
        title="Contact"
        message={`Please select option for contact a  ${customersTransation[0].name}`}
        data={`
Transaction ID: ${customersTransation[0].transationId}
Amount: ${customersTransation[0].amount}
Type: ${customersTransation[0].type.charAt(0).toUpperCase() + customersTransation[0].type.slice(1)}
Date Time: ${new Date(customersTransation[0].timestamp).toLocaleString()}
`}
        onClose={closeAlert}
        onConfirm={confirmAction}
        phoneNumber={customersTransation[0].phoneNumber} // Pass the phone number here
        userName={customersTransation[0].name} // Pass the user's name here
      />



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    marginTop: 10,
    backgroundColor: '#e7e7e7',
  },

  customerCard: {
    flexDirection: 'row',
    padding: 16,
    margin: 3,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#839db3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  initialText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  customerInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  customerPhone: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  customerDetails: {
    marginTop: 1,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    fontSize: 12,
    color: '#007bff',
    marginRight: 8,
    marginTop: 8,
  },
  sendMoneyStatus: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  sendMoneyText: {
    fontSize: 12,
    color: 'white',
  },
  timestampContainer: {
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderRadius: 5,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  timestampText: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
  },
});

export default CustomerList;
