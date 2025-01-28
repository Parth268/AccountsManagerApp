// ChangeThemeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, useColorScheme } from 'react-native';
import { useTheme } from '../../storage/context/ThemeContext';

const ChangeThemeScreen = () => {
    const { theme, toggleTheme } = useTheme();
    const systemTheme = useColorScheme(); // Fetch system theme (light or dark)

    const currentTheme = theme === 'light' ? 'Light' : 'Dark';

    return (

        <View style={globalStyles.container}>
            <View style={styles.header}>
                <Pressable onPress={handleBackPress} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#333" />
                </Pressable>
                <Text style={[globalStyles.textPrimary, styles.title]}>{t("settings")}</Text>
            </View>

            <ScrollView>
                {/* ACCOUNT INFORMATION Section */}
                <View style={styles.section}>
                    <Text style={[globalStyles.textSecondary, styles.sectionTitle]}>{t("account_information")}</Text>

                    <Pressable onPress={toggleTheme} style={styles.item}>
                        <Icon name="notifications-none" size={24} color="#444" style={styles.icon} />
                        <Text style={globalStyles.textPrimary}>{t("notifications_reset")}</Text>
                    </Pressable>
                   
                </View>

               
            </ScrollView>

           
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default ChangeThemeScreen;
