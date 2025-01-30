import React, { useEffect } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import MainNavigator from './src/navigation/MainNavigator';
import { AuthProvider } from './src/storage/context/AuthContext';
import { AppProvider } from './src/storage/context/AppContext';
import { ThemeProvider } from './src/storage/context/ThemeContext';
import NotificationService from './src/services/NotificationService';
import { ErrorBoundary } from 'react-error-boundary';
import i18n from './src/locales/i18n';
import firebase from '@react-native-firebase/app'; // Import Firebase

type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <View>
    <Text>{"Something went wrong."}</Text>
    <Text>{error.message}</Text>
    <Button onPress={resetErrorBoundary} title="Try again" />
  </View>
);

const App = () => {

  useEffect(() => {
    let isMounted = true;

    // Ensure Firebase is initialized
    const initializeFirebase = () => {
      if (!firebase.apps.length) {
        // Initialize Firebase if not already initialized
        firebase.initializeApp({
          apiKey: 'AIzaSyBckuMisi2DLuz5ahV2RiMHEQdC_e1ubZI',
          authDomain: 'account-manager-6e9e0.firebaseapp.com',
          databaseURL: 'https://account-manager-6e9e0.firebaseio.com',
          projectId: 'account-manager-6e9e0',
          storageBucket: 'account-manager-6e9e0.appspot.com',
          messagingSenderId: '498251559925',
          appId: '1:498251559925:android:328c725703a114db3966bc',
        });
      
      } else {
        // If Firebase is already initialized, use the default app
        firebase.app();
      }
    };

    initializeFirebase();

    // Handle notification permissions
    const checkNotificationPermissions = async () => {
      try {
        const granted = await NotificationService.checkPermissions();
        if (isMounted) {
          console.log('Notification permissions:', granted);
          if (!granted) {
            console.warn('Notification permissions not granted');
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error checking notification permissions:', error);
        }
      }
    };

    checkNotificationPermissions();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <AppProvider>
            <AuthProvider>
              <SafeAreaView style={styles.container}>
                <MainNavigator />
              </SafeAreaView>
            </AuthProvider>
          </AppProvider>
        </ThemeProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
