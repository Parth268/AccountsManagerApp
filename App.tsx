import React from 'react';
import { useTranslation } from 'react-i18next';
import MainNavigator from './src/navigation/MainNavigator';
import { AuthProvider } from './src/storage/context/AuthContext';
import { AppProvider } from './src/storage/context/AppContext';

const App = () => {
  
  return (
    <AppProvider>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </AppProvider>
  );
};

export default App;
