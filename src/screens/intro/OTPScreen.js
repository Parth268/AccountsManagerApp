import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../../storage/context/AuthContext";

const OTPScreen = () => {
    const [otp, setOtp] = useState("4532");
    const inputRefs = useRef([]);
    const { login } = useAuth();

    useEffect(() => {
        // Autofocus on the first input field when the component loads
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (value, index) => {
        const otpArray = otp.split("");
        otpArray[index] = value;
        setOtp(otpArray.join(""));

        // Focus on the next field if the current one is filled
        if (value && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleOnPress = () => {
        // Handle OTP submission here
        login("q3tw4yrh")
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Verify OTP</Text>
                <Text style={styles.subtitle}>Enter the 4-digit code sent to your phone.</Text>
            </View>

            {/* OTP Input */}
            <View style={styles.otpInputContainer}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        style={styles.otpInput}
                        keyboardType="numeric"
                        maxLength={1}
                        value={otp[index] || ""}
                        onChangeText={(value) => handleChange(value, index)}
                        placeholderTextColor="#AAAAAA"
                        onFocus={() => {
                            // Highlight the input field when focused (optional)
                        }}
                    />
                ))}
            </View>

            {/* Resend and Confirm */}
            <View style={styles.actionContainer}>
                <TouchableOpacity>
                    <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleOnPress}
                >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EAF6FF",
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
        fontSize: 16,
        color: "#555555",
        textAlign: "center",
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
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    actionContainer: {
        marginTop: 30,
        alignItems: "center",
    },
    resendText: {
        fontSize: 14,
        color: "#000000",
        fontWeight: "bold",
        marginBottom: 15,
    },
    confirmButton: {
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#000000", // Black button
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: "center",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    confirmButtonText: {
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "bold",
    },
});

export default OTPScreen;
