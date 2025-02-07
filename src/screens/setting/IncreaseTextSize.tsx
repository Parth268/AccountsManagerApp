import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Switch,
    Pressable,
    PixelRatio
} from "react-native";
import { useTranslation } from 'react-i18next';
import { useAppTheme } from "../../storage/context/ThemeContext";
import { useLanguage } from "../../storage/context/LanguageContext";
import Slider from '@react-native-community/slider';
import { Snackbar } from "../../components/Snackbar";
import Header from "../../components/Header";

const fontScale = PixelRatio.getFontScale(); // Get system font scale factor

interface Props {
    navigation: any;
}

const IncreaseTextSize: React.FC<Props> = ({ navigation }) => {
    const { t } = useTranslation();
    const { theme, themeProperties } = useAppTheme();
    const { textSize, changeDefaultText, isDefaultText, changeTextSize } = useLanguage();

    const [overrideSettings, setOverrideSettings] = useState(isDefaultText);
    const [textSizeData, setTextSize] = useState(textSize);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const triggerSnackbar = (text: string) => {
        setSnackbarMessage(text);
        setTimeout(() => setSnackbarMessage(""), 2000);
    };

    const handleToggleSwitch = () => {
        setOverrideSettings(prev => !prev);
        changeDefaultText();
    };

    const changeTextData = (value: number) => {
        if (!overrideSettings) {
            setTextSize(value);
            changeTextSize(value);
        } else {
            triggerSnackbar(t('text_size_not_default'));
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: themeProperties.backgroundColor }]}>
            <Header
                navigation={navigation}
                name={t("increase_text_size_A")}
                isHome={false}
                onBack={() => { }}
                rightIcon={<></>}
                phoneNumber={""}
            />

            {/* Toggle Switch */}
            <Pressable onPress={handleToggleSwitch} style={[styles.optionContainer, { backgroundColor: themeProperties.card }]}>
                <Text style={[styles.optionTitle, { fontSize: 16 * fontScale, color: themeProperties.textColor }]}>{t('overrideSettingsTitle')}</Text>
                <Switch
                    value={!overrideSettings}
                    onValueChange={handleToggleSwitch}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={overrideSettings ? "#f5dd4b" : "#f4f3f4"}
                />
            </Pressable>

            {/* Text Size Slider */}
            {!overrideSettings &&
                <View style={[styles.sliderContainer]}>
                    <Slider
                        minimumValue={0}
                        maximumValue={3}
                        step={1}
                        disabled={overrideSettings}
                        value={textSizeData}
                        onValueChange={changeTextData}
                        maximumTrackTintColor="#ddd"
                        style={styles.sliderComponent}
                    />
                    <Text style={[styles.textSizeLabel, { fontSize: (16 + textSizeData * 4) * fontScale, color: themeProperties.text }]}>
                        {t('currentTextSize')}: {textSizeData}
                    </Text>
                </View>
            }
            {/* Snackbar Message */}
            {snackbarMessage && <Snackbar message={snackbarMessage} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    optionContainer: {
        padding: 16,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    optionTitle: {
        fontWeight: "bold",
    },
    sliderContainer: {
        flexDirection: "column",
        alignItems: "center",
        padding: 16,
        borderRadius: 8,
    },
    textSizeLabel: {
        marginTop: 8,
    },
    sliderComponent: {
        width: "100%",
        height: 40,
    },
});

export default IncreaseTextSize;
