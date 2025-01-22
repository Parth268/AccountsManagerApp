import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../../utils/constants";

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("9876543210");
  const [loading, setLoading] = useState(false);

  // Handle login button press
  const handleLogin = async () => {
    if (phoneNumber.length === 10) {
      setLoading(true);

      try {
        // Save phone number in AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.USER_PHONE_NUMBER, phoneNumber);

        setTimeout(() => {
          setLoading(false);
          // Navigate to OTP screen
          navigation.navigate("OTPScreen");
        }, 1500);
      } catch (error) {
        setLoading(false);
        Alert.alert("Error", "Failed to save your number. Please try again.");
      }
    } else {
      // Invalid phone number
      Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit phone number.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Namaste,</Text>
        <Text style={styles.subtitle}>Let's get started.</Text>
        <Text style={styles.description}>Login using your number to continue.</Text>
      </View>

      {/* Avatars */}
      <View style={styles.avatarContainer}>
        <Image
          source={require("../../../assets/a1.png")}
          style={[styles.avatar, styles.avatarTop]}
        />
        <Image
          source={require("../../../assets/a1.png")}
          style={[styles.avatar, styles.avatarLeft]}
        />
        <Image
          source={require("../../../assets/a1.png")}
          style={[styles.avatar, styles.avatarRight]}
        />
      </View>

      {/* Phone Number Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        keyboardType="numeric"
        maxLength={10}
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        placeholderTextColor="#AAAAAA"
        autoFocus
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF6FF", // Soft gradient-like background using flat colors
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 22,
    color: "#555555",
    textAlign: "center",
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: "#777777",
    textAlign: "center",
    marginVertical: 15,
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // Shadow effect for Android
    color: "#000",
  },
  avatarContainer: {
    width: 200,
    height: 200,
    position: "relative",
    marginVertical: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "#F8F8F8", // Subtle background for avatars
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarTop: { top: 0, left: 70 },
  avatarLeft: { top: 50, left: 0 },
  avatarRight: { top: 50, right: 0 },
  loginButton: {
    width: "90%",
    backgroundColor: "#000000", // Black button
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Login;
