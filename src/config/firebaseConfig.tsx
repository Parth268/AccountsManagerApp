import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Use environment variables for security
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBckuMisi2DLuz5ahV2RiMHEQdC_e1ubZI',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'account-manager-6e9e0.firebaseapp.com',
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || 'https://account-manager-6e9e0-default-rtdb.firebaseio.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'account-manager-6e9e0',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'account-manager-6e9e0.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '498251559925',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:498251559925:android:328c725703a114db3966bc',
};

// Initialize Firebase only if it hasn’t been initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export default app;
