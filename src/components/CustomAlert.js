// CustomAlert.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";

const CustomAlert = ({ visible, title, message, onClose, onConfirm }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.alertOverlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>{title}</Text>
          <Text style={styles.alertMessage}>{message}</Text>
          <View style={styles.alertActions}>
            <TouchableOpacity style={styles.alertButton} onPress={onClose}>
              <Text style={styles.alertButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.alertButton, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={{
                 fontSize: 16,
                 color: "#ffffff",
                 fontWeight: "bold",
              }}>Confirm</Text>
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
    backgroundColor: "#fff",
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
    color: "#333",
  },
  alertMessage: {
    fontSize: 16,
    color: "#555",
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
    color: "#007bff",
    fontWeight: "bold",
  },
});

export default CustomAlert;
