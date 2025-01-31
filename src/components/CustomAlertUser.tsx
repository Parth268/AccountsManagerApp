import React from "react";
import { useTranslation } from "react-i18next";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Linking,
} from "react-native";
import { useAppTheme } from "../storage/context/ThemeContext";
import globalStyles from "../styles/globalStyles";
import Ionicons from "react-native-vector-icons/MaterialIcons";

interface CustomAlertUserProps {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
    phoneNumber: string;
    data: string,
    userName: string;
}

const CustomAlertUser: React.FC<CustomAlertUserProps> = ({
    visible,
    title,
    message,
    onClose,
    onConfirm,
    data,
    phoneNumber,
    userName,
}) => {
    const { t } = useTranslation();
    const { themeProperties } = useAppTheme();

    const handleCall = () => {
        Linking.openURL(`tel:${phoneNumber}`);
        onClose()
    };

    const handleMessage = () => {
        const personalizedMessage = `Hello ${userName},${data}`;
        Linking.openURL(`sms:${phoneNumber}?body=${encodeURIComponent(personalizedMessage)}`);
        onClose()
    };

    return (
        <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
            <View style={styles.alertOverlay}>
                <View
                    style={[
                        styles.alertContainer,
                        { backgroundColor: themeProperties.backgroundColor },
                    ]}
                >
                    {/* Close Icon */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color={themeProperties.textColor} />
                    </TouchableOpacity>

                    <Text style={[styles.alertTitle, { color: themeProperties.textColor }]}>
                        {title}
                    </Text>
                    <Text style={[styles.alertMessage, { color: themeProperties.textColor }]}>
                        {message}
                    </Text>

                    <View style={styles.alertActions}>
                        <TouchableOpacity
                            style={[styles.alertButton, styles.callButton]}
                            onPress={handleCall}
                        >
                            <Ionicons name="call" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.alertButtonText}>{t("call")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.alertButton, styles.messageButton]}
                            onPress={handleMessage}
                        >
                            <Ionicons name="sms" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.alertButtonText}>{t("message")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    alertOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker overlay for better focus
        justifyContent: "center",
        alignItems: "center",
    },
    alertContainer: {
        width: "85%",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 8,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1, // Make sure the close icon is above other content
    },
    alertTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 12,
        textAlign: "center",
    },
    alertMessage: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: "center",
    },
    alertActions: {
        flexDirection: "row",
        justifyContent: "space-evenly", // Even spacing between the buttons
        marginTop: 10,
    },
    alertButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
        justifyContent: "center",
    },
    icon: {
        marginRight: 8,
    },
    alertButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    callButton: {
        backgroundColor: "#28a745",
    },
    messageButton: {
        backgroundColor: "#17a2b8",
    },
});

export default CustomAlertUser;
