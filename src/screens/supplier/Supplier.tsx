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


const Supplier: React.FC<Props> = ({ user, navigation, onRefreshList }) => {

  const { t } = useTranslation();
  const { theme, themeProperties } = useAppTheme();
  const [supplierTransation, setSuppliersTransation] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [callAlertVisible, setCallAlertVisible] = useState(false);


  useEffect(() => {
    fetchSupplierData()
  }, [user])

  const fetchSupplierData = () => {
    setSuppliersTransation(user)
  }


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    onRefreshList()
    setRefreshing(false);
  }, []);



  // Render each supplier item
  const renderSupplierItem = ({ item }: { item: User }) => {
    const transactionTimestamp = item?.timestamp
      ? new Date(item?.timestamp)
      : new Date();

    const formattedTimestamp = transactionTimestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    // const supplierData
    const supplierData = supplierTransation?.find(c => c.userId === item?.userId);


    const isDarkMode = theme === 'dark';

    const handleOnPressItem = () => {

      navigation.navigate(NAVIGATION.SUPPLIER_TRANSACTION_SCREEN, {
        supplierData: supplierData
      })

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
                <Pressable onPress={() => setCallAlertVisible(!callAlertVisible)}><Text style={[styles.icon, { color: isDarkMode ? '#00bfff' : '#007bff' }]}>📞</Text></Pressable>
                <Text style={[styles.supplierPhone, { color: isDarkMode ? '#bbb' : '#666' }]}>{item?.phoneNumber}</Text>
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
      ) || null // Returns null if userType is not 'supplier'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}>

      <FlatList
        data={supplierTransation}
        keyExtractor={(item, index) => String(item?.userId + index)}
        renderItem={renderSupplierItem}
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
