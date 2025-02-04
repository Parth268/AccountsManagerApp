import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Switch
} from "react-native";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../storage/context/AuthContext";
import { useAppTheme } from "../../storage/context/ThemeContext";
import Header from "../../components/Header";
import Slider from '@react-native-community/slider';

interface Props {
    navigation: any;
}

const IncreaseTextSize: React.FC<Props> = ({ navigation }) => {

    const { t } = useTranslation();
    const { logout } = useAuth();
    const { theme, toggleTheme, toggleThemeStatus, themeProperties, themeStatus } = useAppTheme();

    const [overrideSettings, setOverrideSettings] = useState<boolean>(false);
    const [textSize, setTextSize] = useState<number>(1); // Default text size is 1

    const handleToggleSwitch = () => setOverrideSettings(!overrideSettings);

    return (
        <View style={styles.container}>
            <Header
                navigation={navigation}
                name={t("increase_text_size_A")}
                isHome={false}
                onBack={() => { }}
                rightIcon={<></>}
                phoneNumber={""}
            />

            <View style={styles.optionContainer}>
                <Text style={styles.optionTitle}>{t('overrideSettingsTitle')}</Text>
                <Switch
                    value={overrideSettings}
                    onValueChange={handleToggleSwitch}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={overrideSettings ? "#f5dd4b" : "#f4f3f4"}
                />
            </View>

            <View style={styles.sliderContainer}>
                <View style={styles.slider}>
                    <Slider
                        minimumValue={0}
                        maximumValue={5}
                        step={1}
                        value={textSize}
                        onValueChange={(value) => setTextSize(value)}
                        minimumTrackTintColor={theme === 'dark' ? "#81b0ff" : "#6200EE"}
                        maximumTrackTintColor={theme === 'dark' ? "#aaa" : "#ddd"}
                        thumbTintColor={theme === 'dark' ? "#f5dd4b" : "#6200EE"}
                        style={styles.sliderComponent}
                    />
                    <Text style={[styles.textSizeLabel, { fontSize: 16 + textSize * 4 }]}>
                        {t('currentTextSize')}: {textSize}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 16,
    },
    optionContainer: {
        backgroundColor: "#1e1e1e",
        padding: 16,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    optionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    optionSubtitle: {
        color: "#aaa",
        fontSize: 12,
        marginTop: 4,
    },
    sliderContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1e1e1e",
        padding: 16,
        borderRadius: 8,
    },
    textLabel: {
        color: "#fff",
        fontSize: 16,
    },
    slider: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        marginHorizontal: 16,
    },
    sliderComponent: {
        width: "100%",
        height: 40,
    },
    textSizeLabel: {
        color: "#fff",
        marginTop: 8,
        fontSize: 14,
    },
});

export default IncreaseTextSize;
