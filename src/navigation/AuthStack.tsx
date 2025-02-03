import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/login/Login";
import OTPScreen from "../screens/login/OTP";
import LanguageSelectionScreen from "../screens/intro/LanguageSelectionScreen";
import { NAVIGATION } from "../utils/constants";
import Register from "../screens/registration/Registration";
import ForgetPassword from "../screens/login/Forgetpassword";

// Defining the navigation parameter list for type safety
type AuthStackParamList = {
  [NAVIGATION.LANGUAGE_SELECTION]: undefined;
  [NAVIGATION.LOGIN]: undefined;
  [NAVIGATION.FORGET_PASSWORD]: undefined;
  [NAVIGATION.REGISTRATION]: undefined;
  [NAVIGATION.OTPSCREEN]: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={NAVIGATION.LANGUAGE_SELECTION} 
        component={LanguageSelectionScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name={NAVIGATION.LOGIN} 
        component={Login} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name={NAVIGATION.FORGET_PASSWORD} 
        component={ForgetPassword} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name={NAVIGATION.REGISTRATION} 
        component={Register} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name={NAVIGATION.OTPSCREEN} 
        component={OTPScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
