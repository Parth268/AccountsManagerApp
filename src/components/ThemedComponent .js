import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useApp } from "../storage/context/AppContext";

const ThemedComponent = () => {
  const { theme } = useApp();

  const styles = theme === "light" ? lightStyles : darkStyles;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is a {theme} themed component!</Text>
    </View>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    color: "#000",
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  text: {
    color: "#fff",
  },
});

export default ThemedComponent;
