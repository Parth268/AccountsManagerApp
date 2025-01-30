import React from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import { useAppTheme } from '../storage/context/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationProp } from "@react-navigation/native";
import { NAVIGATION } from '../utils/constants';

interface Props {
    navigation: NavigationProp<any>;
    name?: string;
    isHome: boolean;
    onBack: () => void;
    rightIcon: React.ReactNode;
    phoneNumber: string;
}

const Header = ({
    navigation,
    name = "",
    isHome = false,
    onBack = () => { },
    rightIcon,
    phoneNumber = ""
}: Props) => {

    const { theme } = useAppTheme();
    const currentTheme = theme === 'light' ? styles.lightTheme : styles.darkTheme;
    const iconColor = theme === 'light' ? "#333" : "#fff"; // Dynamically change the back icon color

    const goBack = () => {
        if (isHome) {
            navigation.navigate(NAVIGATION.DASHBOARD);
        } else {
            navigation.goBack();
            onBack();
        }
    };

    return (
        <>
            <StatusBar
                backgroundColor={theme === "light" ? "#ffffff" : "#000000"}
                barStyle={theme === 'light' ? 'dark-content' : 'light-content'} // Adjust status bar content style
            />

            <View style={[styles.container, currentTheme]}>
                {/* Back Button */}
                {!isHome ? (
                    <Pressable onPress={goBack} accessibilityLabel="Back">
                        <Icon name="arrow-back" size={24} color={iconColor} />
                    </Pressable>
                )
                    :
                    (
                        <View>
                            <Text style={styles.businessName}>{"Business"}</Text>
                            {phoneNumber && (
                                <Text style={styles.ownerName}>{phoneNumber}</Text>
                            )}
                        </View>
                    )}

                {/* Title */}
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: theme === 'light' ? '#333' : '#fff',
                }}>{name}</Text>

                {/* Right Icon */}
                {rightIcon && (
                    <View style={styles.rightIconContainer}>
                        {rightIcon}
                    </View>
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
        marginBottom: 16,
    },
    lightTheme: {
        backgroundColor: '#FFFFFF',
    },
    darkTheme: {
        backgroundColor: '#121212',
    },
    businessName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#007bff",
    },
    ownerName: {
        fontSize: 14,
        color: "#555",
        marginTop: 4,
    },

    rightIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default Header;
