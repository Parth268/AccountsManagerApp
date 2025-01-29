import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View, Text, StyleSheet, Modal } from "react-native"; 
import { DEFAULTS } from "../../utils/constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const [error, setError] = useState(null); // For error messages

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem(DEFAULTS.USER_TOKEN);
        setIsLoggedIn(!!userToken);
      } catch (error) {
        console.error("Failed to load login status:", error);
        setError("Failed to check login status.");
      } finally {
        setIsLoading(false); // Stop loading when check is done
      }
    };
    checkLoginStatus();
  }, []);

  const login = async (token) => {
    try {
      await AsyncStorage.setItem(DEFAULTS.USER_TOKEN, token);
      setIsLoggedIn(true);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(DEFAULTS.USER_TOKEN);
      setIsLoggedIn(false);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Logout failed. Please try again.");
    }
  };

  // Show loading indicator while checking login status
  if (isLoading) {
    return (
      <Modal transparent={true} animationType="fade" visible={isLoading}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
      {error && (
        <Modal transparent={true} animationType="fade" visible={error !== null}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </Modal>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  errorText: {
    fontSize: 18,
    color: "#ff0000",
    padding: 20,
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
});
