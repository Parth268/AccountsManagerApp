import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

interface SnackbarProps {
  message: string;
  duration?: number; // Duration in milliseconds (default: 3000ms)
}

export const Snackbar: React.FC<SnackbarProps> = ({ message, duration = 3000 }) => {
  const translateY = useRef(new Animated.Value(100)).current;

  const showSnackbar = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(hideSnackbar, duration);
    });
  };

  const hideSnackbar = () => {
    Animated.timing(translateY, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Automatically show Snackbar when message changes
  React.useEffect(() => {
    if (message) {
      showSnackbar();
    }
  }, [message]);

  return (
    <Animated.View style={[styles.snackbar, { transform: [{ translateY }] }]}>
      <Text style={styles.snackbarText}>{message}</Text>
    </Animated.View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  snackbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  snackbarText: {
    color: '#fff',
    textAlign: 'center',
  },
});
