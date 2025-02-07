import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
} from "react-native";
import { useAppTheme } from "../../storage/context/ThemeContext";
import { useTranslation } from "react-i18next";
import CustomAlertUser from "../../components/CustomAlertUser";
import { NAVIGATION } from "../../utils/constants";

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

interface Props {
  transation: Transaction[];
  navigation: any;
}

interface Supplier {
  userId: string;
  name: string;
  type: string;
  phoneNumber: string;
  email: string;
}

const Supplier: React.FC<Props> = ({ transation, navigation }: Props) => {
  const { t } = useTranslation();
  const { theme, themeProperties } = useAppTheme();
  const [suppliersTransation, setSuppliersTransation] = useState<Transaction[]>(transation);
  const [refreshing, setRefreshing] = useState(false);
  const [supplier, setSupplier] = useState<Supplier[]>()
  const [alertVisible, setAlertVisible] = useState(false);


  useEffect(() => {
    fetchSupplierData()
  }, [])

  const fetchSupplierData = () => {
    setSupplier([
      {
        userId: "2d4f5gt",
        name: "John Doe",
        type: "supplier",
        phoneNumber: "123-456-7890",
        email: "johndoe@example.com",
      }
    ])
  }

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
    fetchSupplierData()
    setRefreshing(false);
  }, []);


  const handleCall = () => {
    setAlertVisible(!alertVisible)
  }

  // Render each supplier item
  const renderSupplierItem = ({ item }: { item: Transaction }) => {
    const transactionTimestamp = item?.timestamp
      ? new Date(item?.timestamp)
      : new Date();

    const formattedTimestamp = transactionTimestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    // const supplierData
    const supplierData = supplier?.find(c => c.userId === item?.userId);


    const isDarkMode = theme === 'dark';

    const handleOnPressItem = () => {
      navigation.navigate(NAVIGATION.SUPPLIER_TRANSACTION_SCREEN,
        { transction_1: item, supplierData: supplierData }
      )
    }

    return (
      item?.userType === 'supplier' && (
        <Pressable onPress={() => { handleOnPressItem() }} style={[styles.supplierCard, { backgroundColor: isDarkMode ? '#333' : '#ffffff' }]}>
          <View style={styles.imageContainer}>
            <Text style={styles.initialText}>{item?.name.charAt(0).toUpperCase()}</Text>
          </View>

          <View style={styles.supplierInfo}>
            <Text style={[styles.supplierName, { color: isDarkMode ? '#fff' : '#333' }]}>{item?.name}</Text>

            <View style={styles.supplierDetails}>
              <Pressable style={styles.detailItem}>
                <Pressable onPress={handleCall}><Text style={[styles.icon, { color: isDarkMode ? '#00bfff' : '#007bff' }]}>📞</Text></Pressable>
                <Text style={[styles.supplierPhone, { color: isDarkMode ? '#bbb' : '#666' }]}>{item?.phoneNumber}</Text>
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
                  <Text style={styles.sendMoneyText}>{t("debit")}: {item?.amount}</Text>
                ) : (
                  <Text style={styles.sendMoneyText}>{t("credit")}: {item?.amount}</Text>
                )
              }
            </View>

            {/* Timestamp */}
            <View style={styles.timestampContainer}>
              <Text style={[styles.timestampText, { color: isDarkMode ? '#bbb' : '#777' }]}>{formattedTimestamp}</Text>
            </View>
          </View>
        </Pressable>
      ) || null // Returns null if userType is not 'supplier'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}>
      <FlatList
        data={suppliersTransation}
        keyExtractor={(item) => item?.email} // or item.name, if you prefer a unique identifier
        renderItem={renderSupplierItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <CustomAlertUser
        visible={alertVisible}
        title="Contact"
        message={`Please select option for contact a  ${suppliersTransation[0].name}`}
        data={`
Transaction ID: ${suppliersTransation[0].transationId}
Amount: ${suppliersTransation[0].amount}
Type: ${suppliersTransation[0].type.charAt(0).toUpperCase() + suppliersTransation[0].type.slice(1)}
Date Time: ${new Date(suppliersTransation[0].timestamp).toLocaleString()}
`}
        onClose={closeAlert}
        onConfirm={confirmAction}
        phoneNumber={suppliersTransation[0].phoneNumber} // Pass the phone number here
        userName={suppliersTransation[0].name} // Pass the user's name here
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

  supplierCard: {
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
  supplierInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  supplierPhone: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  supplierDetails: {
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

export default Supplier;
