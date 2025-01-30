import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/login/Login";
import OTPScreen from "../screens/login/OTP";
import LanguageSelectionScreen from "../screens/intro/LanguageSelectionScreen";
import { NAVIGATION } from "../utils/constants";
import Register from "../screens/registration/Registration";
import ForgetPassword from "../screens/login/Forgetpassword";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name={NAVIGATION.LANGUAGE_SELECTION} component={LanguageSelectionScreen} options={{ headerShown: false }}/>
            <Stack.Screen name={NAVIGATION.LOGIN} component={Login} options={{ headerShown: false }} />
            <Stack.Screen name={NAVIGATION.FORGET_PASSWORD} component={ForgetPassword} options={{ headerShown: false }} />
            <Stack.Screen name={NAVIGATION.REGISTRATION} component={Register} options={{ headerShown: false }} />
            <Stack.Screen name={NAVIGATION.OTPSCREEN} component={OTPScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default AuthStack;