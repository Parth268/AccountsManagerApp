import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { useAppTheme } from "../../storage/context/ThemeContext";
import { useTranslation } from "react-i18next";
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

const SupplierList: React.FC<Props>  = ({ transation }: Props) => {

  const { t } = useTranslation();
  const { theme, themeProperties } = useAppTheme();
  const [suppliersTransation, setSuppliersTransation] = useState<Transaction[]>(transation);
  const [alertVisible, setAlertVisible] = useState(false);

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const confirmAction = () => {
    // Handle the confirm action
    console.log("User confirmed the action!");
    setAlertVisible(false);
  };


  const handleCall = () => {
    setAlertVisible(!alertVisible)
  }

  const renderSupplierItem = ({ item }: { item: Transaction }) => {
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
      item?.userType === 'supplier' && (
        <View style={[styles.supplierCard, { backgroundColor: isDarkMode ? '#333' : '#ffffff' }]}>
          <View style={styles.imageContainer}>
            <Text style={styles.initialText}>{item?.name.charAt(0).toUpperCase()}</Text>
          </View>

          <View style={styles.supplierInfo}>
            <Text style={[styles.supplierName, { color: isDarkMode ? '#fff' : '#333' }]}>{item?.name}</Text>

            <View style={styles.supplierDetails}>
              <Pressable onPress={handleCall} style={styles.detailItem}>
                <Text style={[styles.icon, { color: isDarkMode ? '#00bfff' : '#007bff' }]}>📞</Text>
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
                  <Text style={styles.sendMoneyText}>{item?.amount}</Text>
                ) : (
                  <Text style={styles.sendMoneyText}>{item?.amount}</Text>
                )
              }
            </View>

            {/* Timestamp */}
            <View style={styles.timestampContainer}>
              {/* Ensure formattedTimestamp is calculated */}
              <Text style={[styles.timestampText, { color: isDarkMode ? '#bbb' : '#777' }]}>{formattedTimestamp}</Text>
            </View>
          </View>
        </View>
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
        contentContainerStyle={{ backgroundColor: themeProperties.backgroundColor }}
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
    marginBottom: 5,
  },
  supplierPhone: {
    fontSize: 12,
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
    fontStyle: 'italic',
  },
});

export default SupplierList;
