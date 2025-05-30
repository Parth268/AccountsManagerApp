import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Pressable
} from "react-native";
import { useAppTheme } from "../../storage/context/ThemeContext";
import { useTranslation } from "react-i18next";
import database from "@react-native-firebase/database";
import Header from "../../components/Header";
import { Snackbar } from "../../components/Snackbar";
import auth from "@react-native-firebase/auth";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { NAVIGATION } from "../../utils/constants";
import BusinessNameModal from "../../components/BusinessNameModal";
import { useApp } from "../../storage/context/AppContext";
import { Transaction, User } from "../types";


interface AddEditCustomerProps {
  customer?: {
    uid: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    imageUrl: string;
  };
  navigation: any;
  route: any;
}




const AddEditCustomer: React.FC<AddEditCustomerProps> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { themeProperties } = useAppTheme();
  const { business, changeBusinessName } = useApp()

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [businessName, setBusinessName] = useState(business)
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [error, setError] = useState("");
  const [customerExistData, setCustomerExitData] = useState<User | null>(null);
  const [isBusiness, setIsBusiness] = useState(false)
  const [businessData, setBusinessData] = useState(business)


  useEffect(() => {
    loadBusinessName()
  }, [])

  const loadBusinessName = async () => {
    setLoading(true);
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
      }

      const rawData: Record<string, any> = snapshot.val();
      const businessName = rawData.businessName
      if (businessName) {
        setBusinessName(businessName)
      } else {
        setBusinessName("")
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleBusiness = async (data: string) => {

    setLoading(true);
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) {
        throw new Error("User is not authenticated");
      }

      const userRef = database().ref(`${userId}`);

      const newEntryRef = userRef.push();

      await newEntryRef.set({
        businessName: data
      });

      triggerSnackbar(t("data_added"))
      setBusinessName(data)
      changeBusinessName(data)
    } catch (error) {
      console.error("Failed to save customer:", error);
      triggerSnackbar(t("something_went_wrong"));
      setBusinessName("")
    } finally {
      setLoading(false);
    }
  }


  const triggerSnackbar = (message: string = "") => {
    setSnackbarMessage(message);
    setTimeout(() => setSnackbarMessage(""), 2000); // Clear after 2 seconds
  };

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    const phoneRegex = /^[0-9]{10}$/; // Adjust regex as needed (e.g., for country codes)
    if (!phoneRegex.test(text)) {
      setError(t("invalid_phone_number"));
    } else {
      setError("");
    }
  };

  const handleExistUser = () => {
    navigation.navigate(NAVIGATION.CUSTOMER_TRANSACTION_SCREEN,
      {
        customerData: customerExistData
      })
  }

  const handleSubmit = async () => {
    if (![name, phoneNumber].every(Boolean)) {
      triggerSnackbar(t("please_fill_name_phone"))
      return;
    }
    const phoneRegex = /^[0-9]{10}$/; // Adjust regex as needed (e.g., for country codes)
    if (!phoneRegex.test(phoneNumber)) {
      triggerSnackbar(t("invalid_phone_number"))
      return;
    }

    let id = btoa(`${phoneNumber}`);

    setLoading(true);

    try {
      const userId = auth().currentUser?.uid;
      if (!userId) {
        throw new Error("User is not authenticated");
      }

      const userRef = database().ref(`${userId}`);

      const snapshot = await userRef.orderByChild("phoneNumber").equalTo(phoneNumber).once("value");

      if (snapshot.exists()) {

        const rawData: Record<string, any> = snapshot.val();

        if (!rawData) {

        } else {

          const key = Object.keys(rawData)[0]; // Assuming there's only one user
          const value = rawData[key]; // Extracting user object

          const user: User = {
            id: value.id ?? "",
            phoneNumber: value.phoneNumber ?? "",
            type: value.type === "receive" || value.type === "send" ? value.type : "receive",
            amount: Number(value.amount) || 0,
            name: value.name ?? "",
            email: value.email ?? "",
            address: value.address ?? "",
            timestamp: value.timestamp ?? "",
            userType: value.userType === "customer" || value.userType === "supplier" ? value.userType : "customer",
            createdAt: value.createdAt ?? "",
            updatedAt: value.updatedAt ?? "",
            userId: key,
            transactions: [],
          };

          setCustomerExitData(user)
          triggerSnackbar(t("phone_exist"))
        }
        return; // Exit function if phone number is already in the database
      }

      // **Step 2: Add new user if phone number is not found**
      const newEntryRef = userRef.push(); // Create a unique key
      const timestamp = Date.now();

      await newEntryRef.set({
        id: id,
        name,
        email,
        phoneNumber,
        businessName,
        address,
        amount: "",
        type: "",
        userType: "customer",
        createdAt: timestamp,
        updatedAt: timestamp,
        transcation: []
      });

      triggerSnackbar(t("data_added"))
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save customer:", error);
      triggerSnackbar(t("something_went_wrong"));
    } finally {
      setLoading(false);
    }
  };



  return (
    <View style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}>
      <Header
        navigation={navigation}
        name={t("add_customer")}
        isHome={false}
        onBack={() => { }}
        rightIcon={<></>}
        phoneNumber={""}
      />
      <View style={{ padding: 16, flex: 1 }}>
        <View style={[styles.inputContainer,{backgroundColor:themeProperties.backgroundColor}]}>
          <Text style={[styles.label,{color:themeProperties.textColor}]}>{t("customer_phone")}</Text>
          <TextInput
            style={[styles.input,{color:themeProperties.textColor}]}
            placeholder={t("enter_customer_phone")}
            value={phoneNumber}
            onChangeText={
              (text) => {
                setPhoneNumber(text);
                setCustomerExitData(null)
              }}
            keyboardType="phone-pad"
            maxLength={10} // Restrict input length
          />
        </View>

        <View style={[styles.inputContainer,{backgroundColor:themeProperties.backgroundColor}]}>
        <Text style={[styles.label,{color:themeProperties.textColor}]}>{t("customer_name")}</Text>
          <TextInput             style={[styles.input,{color:themeProperties.textColor}]} placeholder={t("enter_customer_name")}
            value={name} onChangeText={(name) => {
              setName(name);
              setCustomerExitData(null)
            }} />
        </View>

        <View style={[styles.inputContainer,{backgroundColor:themeProperties.backgroundColor}]}>
          <Text style={[styles.label,{color:themeProperties.textColor}]}>{t("customer_email")}</Text>
          <TextInput             style={[styles.input,{color:themeProperties.textColor}]} placeholder={t("enter_customer_email")} value={email}
            onChangeText={(email) => {
              setEmail(email)
              setCustomerExitData(null)
            }} />
        </View>

        <View style={[styles.inputContainer,{backgroundColor:themeProperties.backgroundColor}]}>
          <Text style={[styles.label,{color:themeProperties.textColor}]}>{t("customer_address")}</Text>
          <TextInput
            style={[styles.input, styles.addressInput,{color:themeProperties.textColor}]}
            placeholder={t("enter_customer_address")}
            value={address}
            onChangeText={(address) => {
              setAddress(address)
              setCustomerExitData(null)
            }}
            multiline
            numberOfLines={3}
          />
        </View>


        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={() => {
          if (!loading) {
            if (businessName) {
              handleSubmit()
            } else {
              setIsBusiness(true)
            }
          }
        }} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? t("loading") : t("add_customer")}</Text>
        </TouchableOpacity>

        {customerExistData &&
          <Pressable onPress={handleExistUser}>

            <View style={[styles.card, { backgroundColor: themeProperties.backgroundColor }]}>
              <View style={[styles.textContainer, { backgroundColor: themeProperties.backgroundColor }]}>
                <Text style={[styles.name, { color: themeProperties.textColor }]}>{t("user_exist")}</Text>

                <Text style={[styles.name, { color: themeProperties.textColor }]}>{customerExistData?.name}</Text>
                <Text style={[styles.info, { color: themeProperties.textColor }]}>{customerExistData?.phoneNumber}</Text>
                <Text style={[styles.info, { color: themeProperties.textColor }]}>{customerExistData?.email}</Text>
              </View>
              <MaterialIcons name="keyboard-arrow-right" size={24} color={
                themeProperties.textColor
              } />
            </View>
          </Pressable>

        }
      </View>
      {/* {loading && <ActivityIndicator size={"large"} />} */}

      {snackbarMessage ? <Snackbar message={snackbarMessage} /> : null}

      <BusinessNameModal
        visible={isBusiness}
        title={t("enter_business_name")}
        onSave={(data) => {
          setBusinessData(data)
          setIsBusiness(!isBusiness)
          handleBusiness(data)
        }}
        inputValueData={businessData}
        onClose={() => {
          setIsBusiness(!isBusiness)
        }}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  addressInput: {
    height: 80,
    textAlignVertical: "top",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: "#555",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#cccccc" },
  buttonText: { fontSize: 18, color: "#fff" },
});

export default AddEditCustomer;
