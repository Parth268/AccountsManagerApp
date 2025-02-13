import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl, Pressable } from "react-native";
import { useAppTheme } from "../../storage/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { NAVIGATION } from "../../utils/constants";
import { User } from "../types";

interface Props {
  user: User[];
  navigation: any;
  onRefreshList: () => {}
}


const Customer: React.FC<Props> = ({ user, navigation, onRefreshList }) => {

  const { t } = useTranslation();
  const { theme, themeProperties } = useAppTheme();
  const [customersTransation, setCustomersTransation] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [callAlertVisible, setCallAlertVisible] = useState(false);


  useEffect(() => {
    fetchCustomerData()
  }, [user])

  const fetchCustomerData = () => {
    setCustomersTransation(user)
  }


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    onRefreshList()
    setRefreshing(false);
  }, []);



  // Render each customer item
  const renderCustomerItem = ({ item }: { item: User }) => {
    const transactionTimestamp = item?.timestamp
      ? new Date(item?.timestamp)
      : new Date();

    const formattedTimestamp = transactionTimestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    // const customerData
    const customerData = customersTransation?.find(c => c.userId === item?.userId);


    const isDarkMode = theme === 'dark';

    const handleOnPressItem = () => {

      navigation.navigate(NAVIGATION.CUSTOMER_TRANSACTION_SCREEN, {
        customerData: customerData
      })

    }

    return (
      item?.userType === 'customer' && (
        <Pressable onPress={() => { handleOnPressItem() }} style={[styles.customerCard, { backgroundColor: isDarkMode ? '#333' : '#ffffff' }]}>
          <View style={styles.imageContainer}>
            <Text style={styles.initialText}>{item?.name.charAt(0).toUpperCase()}</Text>
          </View>

          <View style={styles.customerInfo}>
            <Text style={[styles.customerName, { color: isDarkMode ? '#fff' : '#333' }]}>{item?.name}</Text>

            <View style={styles.customerDetails}>
              <Pressable style={styles.detailItem}>
                <Pressable onPress={() => setCallAlertVisible(!callAlertVisible)}><Text style={[styles.icon, { color: isDarkMode ? '#00bfff' : '#007bff' }]}>📞</Text></Pressable>
                <Text style={[styles.customerPhone, { color: isDarkMode ? '#bbb' : '#666' }]}>{item?.phoneNumber}</Text>
              </Pressable>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            {/* Conditional background color */}
            {item?.amount !== 0 &&
              <View style={[styles.sendMoneyStatus, {
                backgroundColor: item?.type === 'send' ? '#cb4750' : '#8BC34A'
              }]} >
                {
                  item?.type === 'send' ? (
                    <Text style={styles.sendMoneyText}>{t("debit")}: {item?.amount}</Text>
                  ) : (
                    <Text style={styles.sendMoneyText}>{t("credit")} {item?.amount}</Text>
                  )
                }
              </View>
            }
            {/* Timestamp */}
            <View style={styles.timestampContainer}>
              <Text style={[styles.timestampText, { color: isDarkMode ? '#bbb' : '#777' }]}>{formattedTimestamp}</Text>
            </View>
          </View>
        </Pressable>
      ) || null // Returns null if userType is not 'customer'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}>

      <FlatList
        data={customersTransation}
        keyExtractor={(item, index) => String(item?.userId + index)}
        renderItem={renderCustomerItem}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<View style={{
          justifyContent: 'center',
          alignContent: 'center',
          flex: 1,
          alignItems: 'center',
        }}><Text>{t("no_data_found")}</Text></View>} // Display message if empty
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
    fontSize: 11,
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

export default Customer;
