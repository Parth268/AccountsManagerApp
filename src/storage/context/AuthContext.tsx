import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View, Text, StyleSheet, Modal } from "react-native";
import { DEFAULTS } from "../../utils/constants";

// Define types for AuthContext
interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Define types for the AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // New loading state
  const [error, setError] = useState<string | null>(null); // For error messages

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem(DEFAULTS.USER_DATA_ID);
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

  const login = async (token: string) => {
    try {
      await AsyncStorage.setItem(DEFAULTS.USER_DATA_ID, token);
      setIsLoggedIn(true);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.clear()
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

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
