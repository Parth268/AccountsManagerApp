import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next'; // Import the I18nextProvider
import MainNavigator from './src/navigation/MainNavigator';
import { AuthProvider } from './src/storage/context/AuthContext';
import { AppProvider } from './src/storage/context/AppContext';
import { ThemeProvider } from './src/storage/context/ThemeContext';
import { StatusBar } from 'react-native';
import { setupNotificationChannel } from './src/services/NotificationService';

const App = () => {

  useEffect(() => {
    // Request user permissions
    setupNotificationChannel();

    // Setup notification channels (Android)
    // setupNotificationChannels();

    // Initialize notification handlers
    // setupNotificationHandlers();
  }, []);


  return (
    <ThemeProvider>
      <AppProvider>
        <AuthProvider>
          <>
            <StatusBar hidden />
            <MainNavigator />
          </>
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
