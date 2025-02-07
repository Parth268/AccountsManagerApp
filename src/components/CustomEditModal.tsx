import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    TextInput
} from "react-native";
import { useAppTheme } from "../storage/context/ThemeContext";

// Define types for the props
interface CustomerEditModalProps {
    visible: boolean;
    customer_Data: {
        name: string;
        phone: string;
        email: string;
        address: string;
    };
    title:string;
    onClose: () => void;
    onSave: (data: { name: string; phone: string; email: string; address: string }) => void;
}

const CustomerEditModal: React.FC<CustomerEditModalProps> = ({
    visible,
    customer_Data,
    onClose,
    title,
    onSave
}) => {
    const { t } = useTranslation();
    const { themeProperties } = useAppTheme();
    const [formData, setFormData] = useState<{ name: string; phone: string; email: string; address: string }>({
        ...customer_Data
    });

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}>
                    <Text style={[styles.title, { color: themeProperties.textColor }]}>{t("edit_customer")}</Text>
                    
                    <TextInput
                        style={[styles.input, { color: themeProperties.textColor, borderColor: themeProperties.textColor }]}
                        placeholder={t("name")}
                        placeholderTextColor={themeProperties.textColor}
                        value={formData.name}
                        onChangeText={(text) => handleChange("name", text)}
                    />
                    <TextInput
                        style={[styles.input, { color: themeProperties.textColor, borderColor: themeProperties.textColor }]}
                        placeholder={t("phone")}
                        placeholderTextColor={themeProperties.textColor}
                        keyboardType="phone-pad"
                        value={formData.phone}
                        onChangeText={(text) => handleChange("phone", text)}
                    />
                    <TextInput
                        style={[styles.input, { color: themeProperties.textColor, borderColor: themeProperties.textColor }]}
                        placeholder={t("email")}
                        placeholderTextColor={themeProperties.textColor}
                        keyboardType="email-address"
                        value={formData.email}
                        onChangeText={(text) => handleChange("email", text)}
                    />
                    <TextInput
                        style={[styles.input, { color: themeProperties.textColor, borderColor: themeProperties.textColor }]}
                        placeholder={t("address")}
                        placeholderTextColor={themeProperties.textColor}
                        value={formData.address}
                        onChangeText={(text) => handleChange("address", text)}
                    />
                    
                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.buttonText}>{t("cancel")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => {
                            onSave(formData);
                            onClose();
                        }}>
                            <Text style={styles.buttonText}>{t("save")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "85%",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 12,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: "center",
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: "#dc3545",
    },
    saveButton: {
        backgroundColor: "#28a745",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
});

export default CustomerEditModal;
