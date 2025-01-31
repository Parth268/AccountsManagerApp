import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useAppTheme } from "../../storage/context/ThemeContext";
import { useTranslation } from "react-i18next";
import database from "@react-native-firebase/database";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "../../utils/constants";

interface AddEditCustomerProps {
  customer?: {
    uid: string;
    name: string;
    email: string;
    imageUrl: string;
  };
}

const AddEditCustomer: React.FC<AddEditCustomerProps> = ({ customer }) => {
  const { t } = useTranslation();
  const { themeProperties } = useAppTheme();
  const navigation = useNavigation();

  // Form state
  const [name, setName] = useState(customer ? customer.name : "");
  const [email, setEmail] = useState(customer ? customer.email : "");
  const [imageUrl, setImageUrl] = useState(customer ? customer.imageUrl : "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !imageUrl) {
      Alert.alert(t("please_fill_all_fields"));
      return;
    }

    setLoading(true);
    const customerData = { name, email, imageUrl };

    try {
      if (customer) {
        // Edit customer
        await database().ref(`customers/${customer.uid}`).update(customerData);
        Alert.alert(t("customer_updated_successfully"));
      } else {
        // Add new customer
        const newCustomerRef = database().ref("customers").push();
        await newCustomerRef.set(customerData);
        Alert.alert(t("customer_added_successfully"));
      }
      navigation.goBack(); // Navigate back after submitting
    } catch (error) {
      console.error("Failed to save customer:", error);
      Alert.alert(t("something_went_wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}>
      <Text style={styles.heading}>
        {customer ? t("edit_customer") : t("add_customer")}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={t("enter_customer_name")}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder={t("enter_customer_email")}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={t("enter_image_url")}
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      {/* Display image if URL is provided */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
      ) : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? t("loading") : customer ? t("update_customer") : t("add_customer")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 10,
    borderRadius: 8,
    fontSize: 16,
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
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default AddEditCustomer;
