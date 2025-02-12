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
import Ionicons from "react-native-vector-icons/MaterialIcons";
import { Transaction } from "../screens/types";

interface CustomAlertEditTransactionProps {
    visible: boolean;
    title: string;
    inputValueData: Transaction;
    onClose: () => void;
    onSave: (input: Transaction) => void;
}

const CustomAlertEditTransaction: React.FC<CustomAlertEditTransactionProps> = ({
    visible,
    title,
    onClose,
    inputValueData,
    onSave
}) => {
    const { t } = useTranslation();
    const { themeProperties } = useAppTheme();
    const [inputValue, setInputValue] = useState<string>(inputValueData?.amount.toString());

    return (
        <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}>
                    <Text style={[styles.title, { color: themeProperties.textColor }]}>{title}</Text>

                    <TextInput
                        style={[styles.input, { color: themeProperties.textColor, borderColor: themeProperties.textColor }]}
                        placeholder={t("enter_amount")}
                        placeholderTextColor={themeProperties.textColor}
                        value={inputValue}
                        keyboardType="number-pad"
                        onChangeText={(data) => {
                            const numericValue = data.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                            setInputValue(numericValue);
                        }}
                    />


                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.buttonText}>{t("cancel")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => {
                            onSave(
                                {
                                    id: inputValueData.id,
                                    userId: inputValueData?.userId,
                                    phoneNumber: inputValueData?.phoneNumber,
                                    type: inputValueData?.type,
                                    amount: parseInt(inputValue),
                                    name: inputValueData?.name,
                                    imageUrl: inputValueData?.imageUrl,
                                    email: inputValueData?.email,
                                    timestamp: inputValueData?.timestamp,
                                    userType: inputValueData?.userType,
                                    transactionId: inputValueData?.transactionId
                                }
                            )
                            onClose()
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
        marginBottom: 20,
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

export default CustomAlertEditTransaction;