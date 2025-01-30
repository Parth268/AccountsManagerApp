import React from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { useAppTheme } from "../storage/context/ThemeContext"; // Import your theme provider
import globalStyles from "../styles/globalStyles"; // Import global styles

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const { themeProperties } = useAppTheme();

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.alertOverlay]}>
        <View
          style={[
            styles.alertContainer,
            { backgroundColor: themeProperties.backgroundColor },
          ]}
        >
          <Text
            style={[
              styles.alertTitle,
              { color: themeProperties.textColor },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.alertMessage,
              { color: themeProperties.textColor },
            ]}
          >
            {message}
          </Text>
          <View style={styles.alertActions}>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={onClose}
            >
              <Text
                style={[
                  styles.alertButtonText,
                  { color: themeProperties.textColor },
                ]}
              >
                {t("cancel")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.alertButton, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={globalStyles.buttonText}>{t("confirm")}</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    width: "80%",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  alertActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  alertButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  alertButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomAlert;
