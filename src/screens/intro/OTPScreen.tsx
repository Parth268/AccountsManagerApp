import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useAuth } from "../../storage/context/AuthContext";
import { useTranslation } from "react-i18next";

const OTPScreen: React.FC = () => {
    const { t } = useTranslation();
    const [otp, setOtp] = useState<Array<string>>(Array(4).fill("2354"));
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const { login } = useAuth();
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
            if (inputRefs.current[index + 1]?.focus) {
                inputRefs.current[index + 1]?.focus();
            }
        }

        // Move to the previous field if backspace is pressed
        if (!value && index > 0 && inputRefs.current[index - 1]) {
            if (inputRefs.current[index - 1]?.focus) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleOnPress = async () => {
        if (otp.join("").length < 4) {
            Alert.alert(t("error"), t("otp_incomplete"));
            return;
        }

        setIsLoading(true);
        try {
            await login(otp.join(""));
        } catch (error) {
            Alert.alert(t("error"), t("otp_verification_failed"));
        } finally {
            setIsLoading(false);
        }
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.innerContainer}>
                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>{t("verify_otp")}</Text>
                        <Text style={styles.subtitle}>{t("enter_otp_code")}</Text>
                    </View>

                    {/* OTP Input */}
                    <View style={styles.otpInputContainer}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={[
                                    styles.otpInput,
                                    { borderColor: otp[index] ? "#000" : "#DDDDDD" },
                                ]}
                                keyboardType="numeric"
                                maxLength={1}
                                value={otp[index] || ""}
                                onChangeText={(value) => handleChange(value, index)}
                                placeholderTextColor="#AAAAAA"
                            />
                        ))}
                    </View>

                    {/* Resend and Confirm */}
                    <View style={styles.actionContainer}>
                        <TouchableOpacity>
                            <Text style={styles.resendText}>{t("resend_otp")}</Text>
                        </TouchableOpacity>

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
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    innerContainer: {
        flex: 1,
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
        paddingVertical: 15,
        borderRadius: 15,
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
