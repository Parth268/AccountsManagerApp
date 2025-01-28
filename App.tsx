import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/locales/i18n'; // Assuming you have an i18n configuration file
import MainNavigator from './src/navigation/MainNavigator';
import { AuthProvider } from './src/storage/context/AuthContext';
import { AppProvider } from './src/storage/context/AppContext';
import { ThemeProvider } from './src/storage/context/ThemeContext';
import { StatusBar, PermissionsAndroid, Platform } from 'react-native';
import { setupNotificationChannel } from './src/services/NotificationService';

const App = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await setupNotificationChannel();
      } catch (error) {
        console.error('Failed to setup notification channel:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <AppProvider>
          <AuthProvider>
            <>
              <StatusBar hidden backgroundColor="transparent" translucent />
              <MainNavigator />
            </>
          </AuthProvider>
        </AppProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default App;