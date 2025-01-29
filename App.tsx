import React, { useEffect } from 'react';
import { Button, StatusBar, Text, View } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import MainNavigator from './src/navigation/MainNavigator';
import { AuthProvider } from './src/storage/context/AuthContext';
import { AppProvider } from './src/storage/context/AppContext';
import { ThemeProvider } from './src/storage/context/ThemeContext';
import NotificationService from './src/services/NotificationService';
import { ErrorBoundary } from 'react-error-boundary';
import i18n from './src/locales/i18n';

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
              <>
                <StatusBar hidden backgroundColor="transparent" translucent />
                <MainNavigator />
              </>
            </AuthProvider>
          </AppProvider>
        </ThemeProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
};

export default App;