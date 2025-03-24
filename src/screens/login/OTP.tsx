import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useTranslation } from "react-i18next";

const OTP: React.FC<any> = ({ route }) => {
  const { t } = useTranslation();
  const { confirmationResult } = route.params; // Get confirmation result from navigation params
  const [otp, setOtp] = useState<Array<string>>(Array(4).fill(""));
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus on the next field if the current one is filled
    if (value && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Move to the previous field if backspace is pressed
    if (!value && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOnPress = async () => {
    if (otp.join("").length < 4) {
      Alert.alert(t("error"), t("otp_incomplete"));
      return;
    }

    setIsLoading(true);
    try {
      await confirmationResult.confirm(otp.join("")); // Confirm OTP with Firebase
      Alert.alert(t("success"), t("otp_verified"));
      // Navigate to home or dashboard after successful verification
    } catch (error) {
      Alert.alert(t("error"), t("otp_verification_failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("verify_otp")}</Text>
      <Text style={styles.subtitle}>{t("enter_otp_code")}</Text>

      <View style={styles.otpInputContainer}>
        {Array.from({ length: 4 }).map((_, index) => (
          <TextInput
            key={index}
            style={[styles.otpInput, { borderColor: otp[index] ? "#000" : "#DDDDDD" }]}
            keyboardType="numeric"
            maxLength={1}
            value={otp[index] || ""}
            onChangeText={(value) => handleChange(value, index)}
            placeholderTextColor="#AAAAAA"
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleOnPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.confirmButtonText}>{t("confirm")}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
  },
  subtitle: {
    fontSize: 16,
    color: "#555555",
    marginTop: 5,
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "80%",
  },
  otpInput: {
    width: 50,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    color: "#000",
  },
  confirmButton: {
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 30,
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default OTP;
