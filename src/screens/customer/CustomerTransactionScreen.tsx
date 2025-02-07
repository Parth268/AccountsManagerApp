import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  Linking,
  Alert,
  RefreshControl
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../storage/context/ThemeContext';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Using MaterialIcons for the edit icon
import CustomAlertTranscation from '../../components/CustomAlertTranscation';
import CustomerEditModal from '../../components/CustomEditModal';
import { generateAndSharePDF } from '../../utils/pdfUtils';

// Example data structure for transaction entries
interface TransactionEntry {
  id: string;
  date: string;
  time: string;
  amount: number;
  balance: number;
  type: 'gave' | 'got'; // 'gave' = red, 'got' = green
}

interface Props {
  transation: [];
  navigation: any;
  route: any;
}

interface Customer {
  userId: string;
  name: string;
  type: string;
  phoneNumber: string;
  email: string;
}

const transactions: TransactionEntry[] = [
  { id: 'T1001', date: '31 Jan 25', time: '07:34 AM', amount: 56500, balance: 2058, type: 'gave' },
  { id: 'T1002', date: '31 Jan 25', time: '07:34 AM', amount: 9, balance: 2623, type: 'got' },
  { id: 'T1003', date: '31 Jan 25', time: '07:35 AM', amount: 2626, balance: 525, type: 'got' },
  { id: 'T1004', date: '31 Jan 25', time: '07:40 AM', amount: 6, balance: 12, type: 'gave' },
  { id: 'T1005', date: '31 Jan 25', time: '07:45 AM', amount: 120, balance: 1132, type: 'got' },
  { id: 'T1006', date: '31 Jan 25', time: '07:50 AM', amount: 50, balance: 1082, type: 'gave' },
  { id: 'T1007', date: '31 Jan 25', time: '07:55 AM', amount: 230, balance: 1312, type: 'got' },
  { id: 'T1008', date: '31 Jan 25', time: '08:00 AM', amount: 75, balance: 1237, type: 'gave' },
  { id: 'T1009', date: '31 Jan 25', time: '08:10 AM', amount: 600, balance: 1837, type: 'got' },
  { id: 'T1010', date: '31 Jan 25', time: '08:20 AM', amount: 300, balance: 1537, type: 'gave' },
  { id: 'T1011', date: '31 Jan 25', time: '08:30 AM', amount: 180, balance: 1717, type: 'got' },
  { id: 'T1012', date: '31 Jan 25', time: '08:40 AM', amount: 90, balance: 1627, type: 'gave' },
];

const calculateTotal = (transactions: TransactionEntry[]): Promise<{ totalGave: number; totalGot: number }> => {
  return new Promise((resolve) => {
    const totals = transactions.reduce(
      (totals, transaction) => {
        if (transaction.type === 'gave') {
          totals.totalGave += transaction.amount;
        } else if (transaction.type === 'got') {
          totals.totalGot += transaction.amount;
        }
        return totals;
      },
      { totalGave: 0, totalGot: 0 }
    );
    resolve(totals);
  });
};


const CustomerTransactionScreen = ({ route, navigation }: Props) => {

  const { t } = useTranslation();
  const { theme, toggleTheme, toggleThemeStatus, themeProperties, themeStatus } = useAppTheme();
  const { transction_1, customerData } = route.params;

  const [isAlertVisible, setAlertVisible] = React.useState(false);
  const [settlementAmount, setSettlementAmount] = useState(0);
  const [isEditCustomer, setIsEditCustomer] = useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [customer, setCustomer] = React.useState<Customer>(customerData)
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    
    setTimeout(() => {
      setRefreshing(false);
    }, 20);
  };

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    calculateTotal(transactions).then((totals) => {
      let result = totals.totalGot - totals.totalGave
      setSettlementAmount(result)
      console.log(`Total Given: ${totals.totalGave}, Total Received: ${totals.totalGot}`);
    });
  }


  const saveTranscation = () => {

    onRefresh()
  }

  const saveCustomerDetails = () => {
    setIsEditCustomer(!isEditCustomer)
    onRefresh()
  }

  const handleProfileEdit = () => {
    setIsEditCustomer(!isEditCustomer)
  }

  const handleReport = () => {
    generateAndSharePDF(`${customer?.name} Report`, settlementAmount, transactions, customer)
  }

  const handleCall = () => {
    Linking.openURL(`tel:${customer?.phoneNumber}`);
  }

  const handleSMS = () => {
    if (!customer?.name || settlementAmount == null) {
      Alert.alert("Error", "Customer name or settlement amount is missing.");
      return;
    }


    let personalizedMessage = "";

    if (settlementAmount < 0) {
      // Handle negative amounts (e.g., refund, deduction)
      personalizedMessage = `
  Hello ${customer.name},
  Please Pay: ${settlementAmount}
  Thank you!`;
    } else {
      // Regular payment message
      personalizedMessage = `
  Hello ${customer.name},
  You have received a 
  payment of ${settlementAmount} 🎉
  Thank you!`;
    }

    const smsURL = `sms:${customer?.phoneNumber}?body=${encodeURIComponent(personalizedMessage)}`;

    Linking.openURL(smsURL).catch(() =>
      Alert.alert("Error", "Failed to open SMS app.")
    );
  };




  const renderItemList = ({ item }: { item: TransactionEntry }) => {
    const isGave = item.type === 'gave';
    const amountColor = isGave ? 'red' : 'green';

    // Handler for edit button
    const handleEdit = () => {
      // Logic for editing the transaction
      setAlertVisible(!isAlertVisible)
      setInputValue(item?.amount.toString())
      onRefresh()
      // You can navigate to an edit screen or open a modal here
    };



    return (
      <View style={[styles.transactionRow]}>
        <View style={styles.transactionDetails}>
          <Text
            style={[styles.transactionDateTime, { color: themeProperties.textColor, fontSize: themeProperties.textSize - 2 }]}
          >
            {item.date} {item.time}
          </Text>
          <Text
            style={[styles.transactionType, { color: amountColor, fontSize: themeProperties.textSize - 2 }]}
          >
            {isGave ? t('you_gave') : t('you_got')} {t('amt')}: {item.amount}
          </Text>
          <Text
            style={[styles.transactionBalance, { color: themeProperties.textColor, fontSize: themeProperties.textSize - 2 }]}
          >
            {t('bal')} {t('amt')} {item.balance}
          </Text>
        </View>

        {/* Edit Button with Text and Icon */}
        <TouchableOpacity onPress={() => handleEdit()} style={styles.editButton}>
          <Icon name="edit" size={18} color="gray" />
          <Text style={styles.editButtonText}>{t("edit")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}
    >
      <Header
        navigation={navigation}
        name={t("transcation_screen")}
        isHome={false}
        onBack={() => { }}
        rightIcon={<></>}
        phoneNumber={""}
      />
      {/* Top Header Section */}
      <View style={{ paddingHorizontal: 12, flex: 1 }}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            {/* Circular avatar with "P" */}
            {/* <View style={styles.avatarContainer}>
              <Text style={[styles.avatarText, { color: themeProperties.textColor }]}>P</Text>
            </View> */}
            <View style={styles.imageContainer}>
              <Text style={styles.initialText}>{customer?.name.charAt(0).toUpperCase()}</Text>
            </View>
            {/* Name + Customer label */}
            <View style={styles.nameContainer}>
              <Text
                style={[styles.customerName, { color: themeProperties.textColor, fontSize: themeProperties.textSize }]}
              >
                {customer?.name}
              </Text>
              <Text
                style={[styles.customerLabel, { color: themeProperties.textColor, fontSize: themeProperties.textSize - 4 }]}
              >
                {customer?.phoneNumber}
              </Text>
              <Text
                style={[styles.customerLabel, { color: themeProperties.textColor, fontSize: themeProperties.textSize - 4 }]}
              >
                {customer?.type === "customer" ? t('customer') : t('supplier')}
              </Text>
            </View>
          </View>
          {/* "View settings" link */}
          <TouchableOpacity onPress={() => { handleProfileEdit() }}>
            <Text
              style={[styles.settingsText, { color: themeProperties.textColor, fontSize: themeProperties.textSize - 2 }]}
            >
              {t('edit_profile')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Big amount on top-right or below header */}
        <View style={styles.topAmountRow}>
          <Text
            style={[styles.labelText, {
              color: themeProperties.textColor,
              fontSize: themeProperties.textSize - 2
            }]}
          >
            {t('settement')}
          </Text>
          <Text
            style={[styles.amountText, { color: themeProperties.textColor, fontSize: themeProperties.textSize }]}
          >
            {settlementAmount}
          </Text>
        </View>

        {/* Horizontal buttons: Report / Reminder / SMS */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.headerButton} onPress={() => {
            handleReport()
          }}>
            <Text style={[styles.headerButtonText, { color: themeProperties.textColor }]}>
              {t('report')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => {
            handleCall()
          }}>
            <Text style={[styles.headerButtonText, { color: themeProperties.textColor }]}>
              {t('call')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => {
            handleSMS()
          }}>
            <Text style={[styles.headerButtonText, { color: themeProperties.textColor }]}>
              {t('sms')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Razorpay banner (just a placeholder view / or Image) */}
        <View style={styles.bannerContainer}>
          {/* In a real app, you might load an image or a WebView */}
          <Text style={{ color: themeProperties.textColor }}>{t('transcation_list')}</Text>
        </View>



        {/* Transaction list */}
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderItemList({ item })}
          ItemSeparatorComponent={() => (
            <View
              style={{
                borderBottomWidth: 0.8,
                borderBottomColor: '#ddd',
                margin: 8,
              }}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        {/* Bottom totals row */}
        <View style={styles.bottomRow}>
          <TouchableOpacity style={[styles.bottomButton, { backgroundColor: 'red' }]}>
            <Text style={[styles.bottomButtonText, { fontSize: themeProperties.textSize - 2 }]}>
              {t('you_gave')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bottomButton, { backgroundColor: 'green' }]}>
            <Text style={[styles.bottomButtonText, { fontSize: themeProperties.textSize - 2 }]}>
              {t('you_got')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Custom Alert */}
      {inputValue &&
        <CustomAlertTranscation
          visible={isAlertVisible}
          inputValueData={inputValue}
          title={t("change_transcation_detail")}
          onClose={() => setAlertVisible(false)}
          onSave={saveTranscation}
        />
      }

      {customerData &&
        <CustomerEditModal
          visible={isEditCustomer}
          customer_Data={customerData}
          title={t("change_customer_detail")}
          onClose={() => setIsEditCustomer(false)}
          onSave={saveCustomerDetails}
        />
      }

    </SafeAreaView>
  );
};

export default CustomerTransactionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    justifyContent: 'space-between',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },

  transactionDetails: {
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    justifyContent: 'center',
  },
  editButtonText: {
    color: 'gray',
    marginLeft: 5, // Space between the icon and the text
    fontSize: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#fff',
  },
  nameContainer: {
    marginLeft: 12,
  },
  customerName: {
    fontWeight: '600',
    fontSize: 20,
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
  customerLabel: {
    fontWeight: '400',
    fontSize: 12,
  },
  settingsText: {
    textDecorationLine: 'underline',
  },
  topAmountRow: {
    marginTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 15,
    height: 50,
    marginHorizontal: 16,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '400',
  },
  amountText: {
    fontSize: 20,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  headerButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  bannerContainer: {
    backgroundColor: '#EEEEEE',
    height: 50,
    marginHorizontal: 16,
    marginBottom: 15,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  transactionsContainer: {
    flex: 1,
    marginHorizontal: 16,
  },

  transactionDateTime: {
    fontWeight: '400',
    fontSize: 14,
  },
  transactionType: {
    fontWeight: '600',
    fontSize: 16,
    marginVertical: 4,
  },
  transactionBalance: {
    fontWeight: '400',
    fontSize: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    marginHorizontal: 8,
  },
  bottomButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
