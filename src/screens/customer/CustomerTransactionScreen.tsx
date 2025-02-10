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

import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import CustomAlertTransaction from '../../components/CustomAlertTranscation';

// Example data structure for transaction entries
interface TransactionEntry {
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
  transation: TransactionEntry[];
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
  transactions: TransactionEntry[]; // Properly typed array of transactions
}


const calculateTotal = (transactions: TransactionEntry[]): Promise<{ totalGave: number; totalGot: number }> => {
  return new Promise((resolve) => {
    console.log("cLC ", transactions)
    const totals = transactions.reduce(
      (totals, transaction) => {
        if (transaction.type === 'send') {
          totals.totalGave += transaction.amount;
        } else if (transaction.type === 'receive') {
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
  const [customer, setCustomer] = React.useState<User>(customerData)
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<TransactionEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState("send")
  const [transactionValue, setTransactionValue] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const onRefresh = () => {
    setRefreshing(true);

    fetchList().then((data) => {
      let findData = data?.find(c => c.phoneNumber === customerData?.phoneNumber);
      setCustomer(findData || customerData);
      setTransactions(findData?.transactions || []);
    }).finally(() => {
      setRefreshing(false); // Ensure refreshing stops even if fetchList fails
    });
  };

  useEffect(() => {
    fetchData()
    fetchList().then((data) => {
      let findData = data?.find(c => c.phoneNumber === customerData?.phoneNumber);
      console.log("findData ", findData)
      setCustomer(findData || customerData);
      setTransactions(findData?.transactions || []);
    });
  }, [])

  useEffect(() => { fetchData() }, [transactions])

  const fetchData = async () => {
    calculateTotal(transactions).then((totals) => {
      let result = totals.totalGot - totals.totalGave
      setSettlementAmount(result)
      console.log(`Total Given: ${totals.totalGave}, Total Received: ${totals.totalGot}`);
    });
  }

  const fetchList = async (): Promise<User[]> => {
    try {
      const user = auth().currentUser;
      if (!user) {
        console.log("User not authenticated");
        return [];
      }

      const userId = user.uid;

      const userRef = database().ref(userId);

      const snapshot = await userRef.once("value");

      if (!snapshot.exists()) {
        console.log("No data available");
        return [];
      }

      const rawData: Record<string, any> = snapshot.val();
      console.log("rawData ",)
      const users: User[] = Object.entries(rawData).map(([key, value]) => ({
        id: value.id ?? "",
        phoneNumber: value.phoneNumber ?? "",
        type: value.type === "receive" || value.type === "send" ? value.type : "receive", // Defaulting
        amount: Number(value.amount) || 0,
        name: value.name ?? "",
        email: value.email ?? "",
        timestamp: value.timestamp, // Convert timestamp
        userType: value.userType === "customer" || value.userType === "supplier" ? value.userType : "customer", // Defaulting
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
        userId: key, // Firebase key as userId
        transactions: value.transactions
          ? Object.entries(value.transactions).map(([txKey, tx]) => ({
            id: key, // User ID
            userId: key, // Firebase key as userId
            phoneNumber: value.phoneNumber ?? "",
            type: tx?.type === "receive" || tx?.type === "send" ? tx?.type : "unknown",
            amount: Number(tx?.amount) || 0,
            name: value.name ?? "",
            imageurl: "", // If you have an image URL field, assign it properly
            email: value.email ?? "",
            timestamp: tx?.timestamp,
            userType: value.userType === "customer" || value.userType === "supplier" ? value.userType : "customer",
            transactionId: txKey, // Firebase transaction ID
          }))
          : [], // Ensure transactions default to an empty array
      }));



      return users;
    } catch (error) {
      console.error("Error fetching list:", (error as Error).message);
      return [];
    }
  };


  const saveTranscation = () => {
    fetchList()
    fetchData()
    onRefresh()
  }
  const triggerSnackbar = (message: string = "") => {
    setSnackbarMessage(message);
    setTimeout(() => setSnackbarMessage(""), 2000); // Clear after 2 seconds
  };

  const saveCustomerDetails = async(data:{ name: string; phone: string; email: string; address: string }) => {
    setIsEditCustomer(!isEditCustomer)
    if (![data?.name, data?.phone].every(Boolean)) {
      triggerSnackbar(t("please_fill_name_phone"));
      return;
    }
    
    const phoneRegex = /^[0-9]{10}$/; // Adjust regex as needed (e.g., for country codes)
    if (!phoneRegex.test(data?.phone)) {
      triggerSnackbar(t("invalid_phone_number"));
      return;
    }
    
    
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) throw new Error("User is not authenticated");
    
      const userRef = database().ref(`${userId}`);
      
      // Query for an existing user with the same phone number
      const snapshot = await userRef.orderByChild("phoneNumber").equalTo(data?.phone).once("value");
    
      if (snapshot.exists()) {
        // setCustomerExitData({ data?.name, data?.phoneNumber, email });
        triggerSnackbar(t("phone_exist"));
        return;
      }
    
      // Add a new user entry
      const newEntryRef = userRef.push();
      const timestamp = Date.now();
    
      await newEntryRef.set({
        id:userId,
        name:data?.name,
        email: data?.email || "", // Ensure empty fields don’t break the app
        phoneNumber:data?.phone,
        address: data?.address || ""
      });
    
      triggerSnackbar(t("data_added"));
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save customer:", error);
      triggerSnackbar(t("something_went_wrong"));
    } finally {

    }
    
    onRefresh()
  }

  const handleSaveTransaction = async (input: string) => {
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) {
        throw new Error("User is not authenticated");
      }

      const userRef = database().ref(`${userId}`);
      const snapshot = await userRef
        .orderByChild("phoneNumber")
        .equalTo(customerData?.phoneNumber)
        .once("value");

      const timestamp = Date.now();
      const transactionId = userRef.push().key; // Unique transaction ID

      const newTransaction = {
        id: transactionId,
        userId,
        phoneNumber: customerData.phoneNumber,
        type: transactionType,
        amount: input,
        name: customerData.name,
        email: customerData.email,
        timestamp,
        userType: "customer",
      };

      if (snapshot.exists()) {
        // **Step 1: Update existing user**
        const userKey = Object.keys(snapshot.val())[0]; // Get the first user key
        const userTransactionsRef = database().ref(`${userId}/${userKey}/transactions`);

        await userTransactionsRef.push(newTransaction); // Add new transaction
      } else {
        // **Step 2: Create new user and add the transaction**
        const newUserRef = userRef.push();
        await newUserRef.set({
          id: newUserRef.key,
          amount: input,
          name: customerData.name,
          email: customerData.email,
          phoneNumber: customerData.phoneNumber,
          type: transactionType,
          userType: "customer",
          createdAt: timestamp,
          updatedAt: timestamp,
          transactions: [newTransaction], // Save transaction as an array
        });
      }

      fetchList().then((data) => {
        let findData = data?.find(c => c.phoneNumber === customerData?.phoneNumber);
        console.log("findData ", findData)
        setCustomer(findData || customerData);
        setTransactions(findData?.transactions || []);
      });
      console.log("Transaction saved successfully");
    } catch (error) {
      console.error("Failed to save transaction:", error);
    }
    console.log("Transaction Saved:", input);
  };

  const handleProfileEdit = () => {
    setIsEditCustomer(!isEditCustomer)
  }

  const handleReport = () => {
    // generateAndSharePDF(`${customer?.name} Report`, settlementAmount, transactions, customer)
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
    const isGave = item.type === 'send';
    const amountColor = isGave ? 'red' : 'green';

    const transactionTimestamp = item?.timestamp
      ? new Date(item?.timestamp)
      : new Date();

    const formattedTimestamp = transactionTimestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

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
            {formattedTimestamp}
          </Text>
          <Text
            style={[styles.transactionType, { color: amountColor, fontSize: themeProperties.textSize - 2 }]}
          >
            {isGave ? t('you_send') : t('you_got')} {t('amt')}: {item.amount}
          </Text>
          <Text
            style={[styles.transactionBalance, { color: themeProperties.textColor, fontSize: themeProperties.textSize - 2 }]}
          >
            {t('bal')} {t('amt')} {settlementAmount}
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
                {customer?.userType === "customer" ? t('customer') : t('supplier')}
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
          ListEmptyComponent={<View style={{
            justifyContent: 'center',
            alignContent: 'center',
            flex: 1,
            alignItems: 'center',
          }}><Text>{t("no_data_found")}</Text></View>} // Display message if empty
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        {/* Bottom totals row */}
        <View style={styles.bottomRow}>
          <TouchableOpacity onPress={() => {
            setTransactionType("send")
            setModalVisible(!modalVisible)
          }} style={[styles.bottomButton, { backgroundColor: 'red' }]}>
            <Text style={[styles.bottomButtonText, { fontSize: themeProperties.textSize - 2 }]}>
              {t('you_send')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setTransactionType("receive")
            setModalVisible(!modalVisible)

          }} style={[styles.bottomButton, { backgroundColor: 'green' }]}>
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
          onSave={(data)=>{saveCustomerDetails(data)}}
        />
      }

      {
        <CustomAlertTransaction
          visible={modalVisible}
          title="Enter Transaction Amount"
          inputValueData={transactionValue}
          onClose={() => {
            setTransactionValue("")
            setModalVisible(false)
          }}

          onSave={(data) => {
            setTransactionValue("")
            handleSaveTransaction(data)
          }}
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
