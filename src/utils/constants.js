// constants.js

// API Constants
export const API = {
  BASE_URL: 'https://api.example.com/',
  TIMEOUT: 5000,
  ENDPOINTS: {
    LOGIN: 'auth/login',
    SIGNUP: 'auth/signup',
    FETCH_USER: 'user/profile',
  },
};

// App Theme Constants
export const THEME = {
  COLORS: {
    PRIMARY: '#3498db',
    SECONDARY: '#2ecc71',
    BACKGROUND: '#f4f4f4',
    TEXT: '#333333',
    ERROR: '#e74c3c',
    SUCCESS: '#27ae60',
  },
  FONTS: {
    REGULAR: 'Roboto-Regular',
    BOLD: 'Roboto-Bold',
    ITALIC: 'Roboto-Italic',
  },
};

// AsyncStorage Keys
export const STORAGE_KEYS = {
  USER_DATA: 'USER_DATA',
  TOKEN: 'TOKEN',
  USER_PHONE_NUMBER: 'USER_PHONE_NUMBER',
};

// NAVIGATION Keys
export const NAVIGATION = {
  SETTING: 'SETTING',
  DASHBOARD: 'DASHBOARD',
  WEBVIEW: 'WEBVIEW',
  CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
  CHANGE_THEME:'CHANGE_THEME',
  LOGIN:"LOGIN",
  LANGUAGE_SELECTION:"LANGUAGE_SELECTION",
  OTPSCREEN:"OTPSCREEN"
};

// Default Values
export const DEFAULTS = {
  LANGUAGE: 'LANGUAGE',
  COUNTRY: 'COUNTRY',
  USER_TOKEN: 'USER_TOKEN',
  NOTIFICATION_CHANNEL_1_TOKEN: 'NOTIFICATION_CHANNEL_1_TOKEN',
  NOTIFICATION_CHANNEL_NAME: 'NOTIFICATION_CHANNEL_NAME',
  IS_OPEN_FIRST_TIME: "IS_OPEN_FIRST_TIME",
  POLICY_URL: 'https://sites.google.com/view/app-loom-privacy-policy/home',
  TERM_AND_CONDITION:'https://sites.google.com/view/app-loom-privacy-policy/home',
};

// App Constants
export const APP = {
  NAME: 'MyReactNativeApp',
  VERSION: '1.0.0',
};

// Debug Settings
export const DEBUG = {
  ENABLE_LOGGING: true,
  SHOW_ERRORS: true,
};

// Helper Function to Log Constants (Optional)
export const logConstants = () => {
  console.log('API:', API);
  console.log('THEME:', THEME);
  console.log('STORAGE_KEYS:', STORAGE_KEYS);
  console.log('DEFAULTS:', DEFAULTS);
  console.log('APP:', APP);
  console.log('DEBUG:', DEBUG);
};

