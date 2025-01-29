import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/intro/Login";
import OTPScreen from "../screens/intro/OTPScreen";
import LanguageSelectionScreen from "../screens/intro/LanguageSelectionScreen";
import { NAVIGATION } from "../utils/constants";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name={NAVIGATION.LANGUAGE_SELECTION} component={LanguageSelectionScreen} options={{ headerShown: false }}/>
            <Stack.Screen name={NAVIGATION.LOGIN} component={Login} options={{ headerShown: false }} />
            <Stack.Screen name={NAVIGATION.OTPSCREEN} component={OTPScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default AuthStack;