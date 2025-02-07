import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Text
} from "react-native";
import { useAppTheme } from "../../storage/context/ThemeContext";
import { useTranslation } from "react-i18next";
import database from "@react-native-firebase/database";
import Header from "../../components/Header";

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
}

const AddEditCustomer: React.FC<AddEditCustomerProps> = ({ customer, navigation }) => {
  const { t } = useTranslation();
  const { themeProperties } = useAppTheme();

  // Form state
  const [name, setName] = useState(customer ? customer.name : "");
  const [email, setEmail] = useState(customer ? customer.email : "");
  const [phoneNumber, setPhoneNumber] = useState(customer ? customer.phoneNumber : "");
  const [address, setAddress] = useState(customer ? customer.address : "");
  const [imageUrl, setImageUrl] = useState(customer ? customer.imageUrl : "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !phoneNumber || !address || !imageUrl) {
      Alert.alert(t("please_fill_all_fields"));
      return;
    }

    setLoading(true);
    const customerData = { name, email, phoneNumber, address, imageUrl };

    try {
      if (customer) {
        await database().ref(`customers/${customer.uid}`).update(customerData);
        Alert.alert(t("customer_updated_successfully"));
      } else {
        const newCustomerRef = database().ref("customers").push();
        await newCustomerRef.set(customerData);
        Alert.alert(t("customer_added_successfully"));
      }
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save customer:", error);
      Alert.alert(t("something_went_wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}>
      <Header
        navigation={navigation}
        name={customer ? t("edit_customer") : t("add_customer")}
        isHome={false}
        onBack={() => { }}
        rightIcon={<></>}
        phoneNumber={""}
      />
      <View style={{ padding: 16, flex: 1 }}>
        <TextInput style={styles.input} placeholder={t("enter_customer_phone")} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder={t("enter_customer_name")} value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder={t("enter_customer_email")} value={email} onChangeText={setEmail} />
        <TextInput
          style={[styles.input, styles.addressInput]}
          placeholder={t("enter_customer_address")}
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
        />
        {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.imagePreview} /> : null}
        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? t("loading") : customer ? t("update_customer") : t("add_customer")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
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

export default AddEditCustomer;