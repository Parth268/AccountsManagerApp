import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Switch,
} from "react-native";
import { useAppTheme } from "../../storage/context/ThemeContext";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../storage/context/AuthContext";
import { useLanguage } from "../../storage/context/LanguageContext";

interface ModeStatusProps {
  navigation: any;
}

interface RadioButtonProps {
  label: string;
  value: boolean;
  selectedValue: boolean;
  onPress: (value: boolean) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, value, selectedValue, onPress }) => {
  const { theme, toggleTheme, themeProperties } = useAppTheme();

  return (
    <Pressable onPress={() => onPress(value)} style={styles.radioContainer}>
      <View style={[styles.radio, selectedValue === value && styles.selectedRadio]} />
      <Text style={[styles.itemText, { color: themeProperties.textColor }]}>
        {label}
      </Text>
    </Pressable>
  );
};

const ModeStatus: React.FC<ModeStatusProps> = ({ navigation }) => {

  const { t } = useTranslation();
  const {  toggleThemeStatus, themeProperties, themeStatus } = useAppTheme();
  const [selectedValue, setSelectedValue] = useState(themeStatus);


  const handlePress = (value: boolean) => {
    setSelectedValue(value);
    toggleThemeStatus(value);
  };



  return (
    <View style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}>
      <Header
        navigation={navigation}
        name={t("mode")}
        isHome={false}
        onBack={() => { }}
        rightIcon={<></>}
        phoneNumber={""}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionHeader, { color: themeProperties.textColor }]}>{t("dark_mode")}</Text>

        <RadioButton
          label={t("off")}
          value={false}
          selectedValue={selectedValue}
          onPress={handlePress}
        />
        <RadioButton
          label={t("follow_on_setting")}
          value={true}
          selectedValue={selectedValue}
          onPress={handlePress}
        />

      </ScrollView>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 10,
  },
  selectedRadio: {
    backgroundColor: '#c7d4e1',
    padding: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },

  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  icon: {
    marginRight: 15,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  itemSubText: {
    color: "gray",
    fontSize: 14,
  },
});

export default ModeStatus;
