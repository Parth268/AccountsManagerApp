import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  FlatList,
  Linking,
  Alert,
  RefreshControl,
  ActivityIndicator
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
import { User, Transaction } from '../types'
import { Snackbar } from '../../components/Snackbar';
import CustomAlertEditTransaction from '../../components/CustomAlertEditTranscation';
import AddressModal from '../../components/AddressModal';


interface Props {
  transation: Transaction[];
  navigation: any;
  route: any;
}


const calculateTotal = (transactions: Transaction[]): Promise<{ totalGave: number; totalGot: number }> => {
  return new Promise((resolve) => {
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


const SupplierTransactionScreen = ({ route, navigation }: Props) => {

  const { t } = useTranslation();
  const { themeProperties } = useAppTheme();
  const { supplierData } = route.params;

  const [isAlertVisible, setAlertVisible] = React.useState(false);
  const [settlementAmount, setSettlementAmount] = useState(0);
  const [isEditSupplier, setIsEditSupplier] = useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [supplier, setSupplier] = React.useState<User>(supplierData)
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState("send")
  const [transactionValue, setTransactionValue] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [isEditTransaction, setIsEditTransaction] = useState<boolean>(false)
  const [editTransaction, setEditTransaction] = useState<Transaction>()
  const [isLoading, setIsLoading] = useState(false);
  const [showAddress, setShowAddress] = useState(false)
  const [addressData, setAddressData] = useState(supplierData?.address)


  const fetchListData = async () => {
    setIsLoading(true)
    try {
      fetchList().then((data) => {
        let findData = data?.find(c => c.id === supplierData?.id);
        if (findData) {
          setSupplier(findData);
          if (findData?.address) {
            setAddressData(findData?.address)
          }
          setTransactions(findData?.transactions);
        }
      })
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false)

    }
  };

  useEffect(() => {
    fetchListData();
  }, []);

  const onRefresh = () => {
    fetchListData();
  };


  useEffect(() => { fetchData() }, [transactions])

  const fetchData = async () => {
    calculateTotal(transactions).then((totals) => {
      let result = totals.totalGot - totals.totalGave
      setSettlementAmount(result)
    });
  }

  const fetchList = async (): Promise<User[]> => {
    try {
      const user = auth().currentUser;
      if (!user) {
        return [];
      }

      const userId = user.uid;

      const userRef = database().ref(userId);

      const snapshot = await userRef.once("value");

      if (!snapshot.exists()) {
        return [];
      }

      const rawData: Record<string, any> = snapshot.val();

      const users: User[] = Object.entries(rawData).map(([key, value]) => ({
        id: value.id ?? "",
        phoneNumber: value.phoneNumber ?? "",
        type: value.type === "receive" || value.type === "send" ? value.type : "receive",
        amount: Number(value.amount) || 0,
        name: value.name ?? "",
        email: value.email ?? "",
        timestamp: value.timestamp ?? "",
        userType: value.userType === "supplier" || value.userType === "supplier" ? value.userType : "customer",
        createdAt: value.createdAt ?? "",
        address: value.address || "",

        updatedAt: value.updatedAt ?? "",
        userId: key,
        transactions: value.transactions
          ? Object.entries(value.transactions).map(([txKey, tx]) => {
            const transaction = tx as Transaction;
            return {
              id: key, // User ID
              userId: key,
              phoneNumber: value.phoneNumber ?? "",
              type: transaction.type === "receive" || transaction.type === "send" ? transaction.type : "unknown",
              amount: Number(transaction.amount) || 0,
              name: value.name ?? "",
              imageUrl: "",
              email: value.email ?? "",
              timestamp: transaction.timestamp ?? "",
              userType: value.userType === "supplier" || value.userType === "supplier" ? value.userType : "customer",
              transactionId: transaction.id ?? "",
            };
          })
          : [],
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

  const saveEditedTransaction = async (data: Transaction) => {
    setIsEditSupplier(false); // Closing edit modal

    try {
      const userId = auth().currentUser?.uid;
      if (!userId) throw new Error("User is not authenticated");

      const userRef = database().ref(`${userId}`);
      const snapshot = await userRef
        .orderByChild("phoneNumber")
        .equalTo(supplierData?.phoneNumber)
        .once("value");

      if (snapshot.exists()) {
        const userKey = Object.keys(snapshot.val())[0]; // Get the first matching key
        const userTransactionsRef = database().ref(`${userId}/${userKey}`);
        let transactionsList: Transaction[] = transactions
        let index = transactionsList.findIndex(t => t.transactionId === data.transactionId);
        if (index !== -1) {
          transactionsList[index] = { ...transactionsList[index], amount: data?.amount }; // Update the object
        }

        await userTransactionsRef.update({
          transactions: transactionsList
        }); // Using update instead of push

        triggerSnackbar(t("data_updated")); // Updated success message
        setTransactions([...transactionsList]); // Clear transactions if needed
      }
    } catch (error) {
      console.error("Failed to save supplier:", error);
      triggerSnackbar(t("something_went_wrong"));
    }
  }

  const triggerSnackbar = (message: string = "") => {
    setSnackbarMessage(message);
    setTimeout(() => setSnackbarMessage(""), 2000); // Clear after 2 seconds
  };

  const saveCustomerDetails = async (data: { name: string; phoneNumber: string; email: string; address: string }) => {
    setIsEditSupplier(false); // Closing edit modal

    console.log("Data:", data);

    if (![data?.name, data?.phoneNumber].every(Boolean)) {
      triggerSnackbar(t("please_fill_name_phone"));
      return;
    }

    const phoneRegex = /^[0-9]{10}$/; // Modify if needed for country codes
    if (!phoneRegex.test(data?.phoneNumber)) {
      triggerSnackbar(t("invalid_phone_number"));
      return;
    }

    try {
      const userId = auth().currentUser?.uid;
      if (!userId) throw new Error("User is not authenticated");

      const userRef = database().ref(`${userId}`);
      const snapshot = await userRef
        .orderByChild("phoneNumber")
        .equalTo(supplierData?.phoneNumber)
        .once("value");

      if (snapshot.exists()) {
        const timestamp = Date.now();
        const userKey = Object.keys(snapshot.val())[0]; // Get the first matching key
        const userTransactionsRef = database().ref(`${userId}/${userKey}`);

        const updatedEntry = {
          id: userId,
          name: data.name,
          email: data.email || "", // Default empty fields
          phoneNumber: data.phoneNumber,
          address: data.address || "",
          updatedAt: timestamp
        };

        console.log("updatedEntry ", updatedEntry)

        await userTransactionsRef.update(updatedEntry); // Using update instead of push
        triggerSnackbar(t("data_updated")); // Updated success message

        // setSupplier(updatedEntry);

        // setTransactions([]); // Clear transactions if needed


        const Entry: User = {
          id: userId,
          name: data.name,
          email: data.email || "", // Default empty fields
          phoneNumber: data.phoneNumber,
          type: supplier?.type || "receive", // Default to existing or a valid type
          amount: supplier?.amount || 0, // Default amount
          timestamp: Date.now().toString(), // Convert timestamp to string
          userType: supplier?.userType || "supplier", // Default userType
          createdAt: supplier?.createdAt || Date.now().toString(), // Keep original createdAt
          updatedAt: Date.now().toString(), // Ensure updatedAt is a string
          userId: userId,
          address: data.address || "",
          transactions: supplier?.transactions || [] // Preserve existing transactions
        };

        console.log("updatedEntry ", Entry);
        if (data?.address) {
          setAddressData(data?.address)
        }
        setSupplier(Entry);
        setTransactions(supplier?.transactions); // Clear transactions if needed

      }
    } catch (error) {
      console.error("Failed to save supplier:", error);
      triggerSnackbar(t("something_went_wrong"));
    }
  };


  const handleSaveTransaction = async (input: string) => {
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) {
        throw new Error("User is not authenticated");
      }

      const userRef = database().ref(`${userId}`);
      const snapshot = await userRef
        .orderByChild("phoneNumber")
        .equalTo(supplierData?.phoneNumber)
        .once("value");

      const timestamp = Date.now();
      const transactionId = userRef.push().key; // Unique transaction ID

      const newTransaction = {
        id: transactionId,
        userId,
        phoneNumber: supplierData.phoneNumber,
        type: transactionType,
        amount: input,
        name: supplierData.name,
        email: supplierData.email,
        timestamp,
        userType: "supplier",
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
          name: supplierData.name,
          email: supplierData.email,
          phoneNumber: supplierData.phoneNumber,
          type: transactionType,
          userType: "supplier",
          createdAt: timestamp,
          updatedAt: timestamp,
          transactions: [newTransaction], // Save transaction as an array
        });
      }

      fetchList().then((data) => {
        let findData = data?.find(c => c.phoneNumber === supplierData?.phoneNumber);
        setSupplier(findData || supplierData);
        if (findData?.address) {
          setAddressData(findData?.address)
        }
        setTransactions(findData?.transactions || []);
      });
    } catch (error) {
      console.error("Failed to save transaction:", error);
    }
  };

  const handleProfileEdit = () => {
    setIsEditSupplier(!isEditSupplier)
  }

  const handleReport = () => {
    generateAndSharePDF(`${supplier?.name} Report`, settlementAmount, transactions, supplier)
  }

  const handleCall = () => {
    Linking.openURL(`tel:${supplier?.phoneNumber}`);
  }

  const handleSMS = () => {
    if (!supplier?.name || settlementAmount == null) {
      Alert.alert("Error", "Customer name or settlement amount is missing.");
      return;
    }


    let personalizedMessage = "";

    if (settlementAmount < 0) {
      // Handle negative amounts (e.g., refund, deduction)
      personalizedMessage = `
  Hello ${supplier.name},
  Please Pay: ${settlementAmount}
  Thank you!`;
    } else {
      // Regular payment message
      personalizedMessage = `
  Hello ${supplier.name},
  You have received a 
  payment of ${settlementAmount} 🎉
  Thank you!`;
    }

    const smsURL = `sms:${supplier?.phoneNumber}?body=${encodeURIComponent(personalizedMessage)}`;

    Linking.openURL(smsURL).catch(() =>
      Alert.alert("Error", "Failed to open SMS app.")
    );
  };




  const renderItemList = ({ item }: { item: Transaction }) => {
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
    const handleEdit = (item: Transaction) => {
      setEditTransaction(item)
      // Logic for editing the transaction
      setIsEditTransaction(!isEditTransaction)
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
          {/* <Text
            style={[styles.transactionBalance, { color: themeProperties.textColor, fontSize: themeProperties.textSize - 2 }]}
          >
            {t('bal')} {t('amt')} {settlementAmount}
          </Text> */}
        </View>

        {/* Edit Button with Text and Icon */}
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
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
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={themeProperties.textColor} />
        </View>
      ) : (
        <View style={{ paddingHorizontal: 12, flex: 1 }}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              {/* Circular avatar with "P" */}
              {/* <View style={styles.avatarContainer}>
                     <Text style={[styles.avatarText, { color: themeProperties.textColor }]}>P</Text>
                   </View> */}
              <View style={styles.imageContainer}>
                <Text style={styles.initialText}>{supplier?.name.charAt(0).toUpperCase()}</Text>
              </View>
              {/* Name + Customer label */}
              <View style={styles.nameContainer}>
                <Text
                  style={[styles.customerName, {
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: themeProperties.textColor, fontSize: themeProperties.textSize
                  }]}
                >
                  {supplier?.name}
                  <Text
                    style={[{
                      color: themeProperties.textColor,
                      fontSize: themeProperties.textSize - 6
                    }]}
                  >
                    {supplier?.userType === "customer" ? " (" + t('customer') + ")" : " (" + t('supplier') + ")"}
                  </Text>
                </Text>
                <Text
                  style={[styles.customerLabel, { color: themeProperties.textColor, fontSize: themeProperties.textSize - 4 }]}
                >
                  {supplier?.phoneNumber}
                </Text>
                {addressData &&
                  <Pressable onPress={() => {
                    setShowAddress(!showAddress)
                  }}>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#0e6ed3",
                      }}
                    >
                      {t("show_address")}
                    </Text>
                  </Pressable>
                }
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
          <View style={[styles.topAmountRow, {
            backgroundColor: themeProperties.backgroundColor,
            borderColor: themeProperties.borderColor,
          }]}>
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
          {/* <View style={[styles.bannerContainer, {
                 backgroundColor: themeProperties.backgroundColor,
                 borderColor: themeProperties.borderColor,
               }]}> */}

          <View style={[styles.topAmountRow, {
            backgroundColor: themeProperties.backgroundColor,
            borderColor: themeProperties.borderColor,
          }]}>
            {/* In a real app, you might load an image or a WebView */}
            <Text style={[styles.labelText, {
              color: themeProperties.textColor,
              fontSize: themeProperties.textSize - 2
            }]}
            >{t('transcation_list')}</Text>
          </View>



          {/* Transaction list */}
          <FlatList
            data={transactions}
            keyExtractor={(item, index) => item?.id ? String(item.id + index) : String(index)}
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
            ListEmptyComponent={
              <View
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <Text>{t("no_data_found")}</Text>
              </View>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />


          {/* Bottom totals row */}
          <View style={[styles.bottomRow, {
            backgroundColor: themeProperties.backgroundColor,
          }]}>
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
      )
      }


      {showAddress && addressData &&
        <AddressModal onClose={() => { setShowAddress(false) }} showAddress={showAddress} address={addressData} />
      }


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

      {supplierData &&
        <CustomerEditModal
          visible={isEditSupplier}
          customer_Data={supplierData}
          title={t("change_supplier_detail")}
          onClose={() => setIsEditSupplier(false)}
          onSave={(data) => { saveCustomerDetails(data) }}
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


      {editTransaction && isEditTransaction &&
        <CustomAlertEditTransaction
          visible={isEditTransaction}
          title="Enter Transaction Amount"
          inputValueData={editTransaction}
          onClose={() => {
            setIsEditTransaction(false)
          }}

          onSave={(data) => {
            setIsEditTransaction(false)
            saveEditedTransaction(data)
          }}
        />
      }

      {snackbarMessage ? <Snackbar message={snackbarMessage} /> : null}

    </SafeAreaView>
  );
};

export default SupplierTransactionScreen;

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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  supplierName: {
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
  supplierInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  supplierLabel: {
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
    borderWidth: 0.5,
    paddingVertical: 15,
    marginBottom: 10,
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
  customerName: {
    fontWeight: '600',
    fontSize: 20,
  },
  customerInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  customerLabel: {
    fontWeight: '400',
    fontSize: 12,
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
