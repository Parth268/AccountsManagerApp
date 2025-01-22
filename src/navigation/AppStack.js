import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashBoard from "../screens/dashboard/Dashboard";

import { NAVIGATION } from "../utils/constants";
import SettingsScreen from "../screens/setting/SettingsScreen";

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={NAVIGATION.DASHBOARD} component={DashBoard} options={{ headerShown: false }} />
      <Stack.Screen name={NAVIGATION.SETTING} component={SettingsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppStack;
