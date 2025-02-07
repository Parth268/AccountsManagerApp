import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Text,
  ActivityIndicator
} from "react-native";
import { useAppTheme } from "../../storage/context/ThemeContext";
import { useTranslation } from "react-i18next";
import database from "@react-native-firebase/database";
import Header from "../../components/Header";
import { Snackbar } from "../../components/Snackbar";

interface AddEditSupplierProps {
  supplier?: {
    uid: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    imageUrl: string;
  };
  navigation: any;
}

const AddEditSupplier: React.FC<AddEditSupplierProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { themeProperties } = useAppTheme();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [error, setError] = useState("");


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


    setLoading(true);
    const supplierData = { name, email, phoneNumber, address };

    try {

      const newSupplierRef = database().ref("suppliers").push();
      await newSupplierRef.set(supplierData);
      Alert.alert(t("supplier_added_successfully"));
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save supplier:", error);
      Alert.alert(t("something_went_wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}>
      <Header
        navigation={navigation}
        name={t("add_supplier")}
        isHome={false}
        onBack={() => { }}
        rightIcon={<></>}
        phoneNumber={""}
      />
      <View style={{ padding: 16, flex: 1 }}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("supplier_phone")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("enter_supplier_phone")}
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={10} // Restrict input length
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("supplier_name")}</Text>
          <TextInput style={styles.input} placeholder={t("enter_supplier_name")} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("supplier_email")}</Text>
          <TextInput style={styles.input} placeholder={t("enter_supplier_email")} value={email} onChangeText={setEmail} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("supplier_address")}</Text>
          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder={t("enter_supplier_address")}
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />
        </View>


        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? t("loading") : t("add_supplier")}</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size={"large"} />}

      {snackbarMessage ? <Snackbar message={snackbarMessage} /> : null}

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
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#cccccc" },
  buttonText: { fontSize: 18, color: "#fff" },
});

export default AddEditSupplier;
