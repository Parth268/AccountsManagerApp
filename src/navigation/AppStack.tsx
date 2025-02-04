import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashBoard from "../screens/dashboard/Dashboard";
import { NAVIGATION } from "../utils/constants";
import Settings from "../screens/setting/Settings";
import WebViewScreen from "../screens/webview/WebView";
import ChangeLanguage from "../screens/setting/ChangeLanguage";
import ChangeThemeScreen from "../screens/setting/ChangeTheme";
import ChangePassword from "../screens/setting/ChangePassword";
import CustomerList from "../screens/customer/CustomerList";
import AddEditCustomer from '../screens/customer/AddEditCustomer';
import SupplierList from "../screens/supplier/SupplierList";
import ModeStatus from "../screens/setting/ModeStatus";
import IncreaseTextSize from "../screens/setting/IncreaseTextSize";

type RootStackParamList = {
  [NAVIGATION.DASHBOARD]: undefined;
  [NAVIGATION.SETTING]: undefined;
  [NAVIGATION.CUSTOMER_LIST]: undefined;
  [NAVIGATION.SUPPLIER_LIST]: undefined;
  [NAVIGATION.ADD_EDIT_CUSTOMER]: undefined;
  [NAVIGATION.WEBVIEW]: undefined;
  [NAVIGATION.CHANGE_PASSWORD]: undefined;
  [NAVIGATION.CHANGE_THEME]: undefined;
  [NAVIGATION.CHANGE_LANGUAGE]: undefined;
  [NAVIGATION.MODE_STATUS]: undefined;
  [NAVIGATION.CHANGE_TEXT_SIZE]:undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={NAVIGATION.DASHBOARD} 
        component={DashBoard} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name={NAVIGATION.SETTING} 
        component={Settings} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name={NAVIGATION.CHANGE_TEXT_SIZE} 
        component={IncreaseTextSize} 
        options={{ headerShown: false }} 
      />
       <Stack.Screen 
        name={NAVIGATION.MODE_STATUS} 
        component={ModeStatus} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name={NAVIGATION.CUSTOMER_LIST} 
        component={CustomerList}
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name={NAVIGATION.SUPPLIER_LIST} 
        component={SupplierList}
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name={NAVIGATION.ADD_EDIT_CUSTOMER} 
        component={AddEditCustomer} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name={NAVIGATION.WEBVIEW} 
        component={WebViewScreen}
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name={NAVIGATION.CHANGE_PASSWORD} 
        component={ChangePassword} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name={NAVIGATION.CHANGE_THEME} 
        component={ChangeThemeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name={NAVIGATION.CHANGE_LANGUAGE} 
        component={ChangeLanguage} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default AppStack;
