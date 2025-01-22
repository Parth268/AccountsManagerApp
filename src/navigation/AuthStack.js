import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/intro/Login";
import OTPScreen from "../screens/intro/OTPScreen";
import LanguageSelectionScreen from "../screens/intro/LanguageSelectionScreen";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="LanguageSelectionScreen" component={LanguageSelectionScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="OTPScreen" component={OTPScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default AuthStack;