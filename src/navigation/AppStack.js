import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashBoard from "../screens/dashboard/Dashboard";

import { NAVIGATION } from "../utils/constants";
import Settings from "../screens/setting/Settings";
import WebViewScreen from "../screens/webview/WebView";
import ChangeLanguage from "../screens/setting/ChangeLanguage";
import ChangeThemeScreen from "../screens/setting/ChangeTheme";

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={NAVIGATION.DASHBOARD} component={DashBoard} options={{ headerShown: false }} />
      <Stack.Screen name={NAVIGATION.SETTING} component={Settings} options={{ headerShown: false }} />
      <Stack.Screen name={NAVIGATION.WEBVIEW} component={WebViewScreen} options={{ headerShown: false }} />
      <Stack.Screen name={NAVIGATION.CHANGE_THEME} component={ChangeThemeScreen} options={{ headerShown: false }} />
      <Stack.Screen name={NAVIGATION.CHANGE_LANGUAGE} component={ChangeLanguage} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppStack;
