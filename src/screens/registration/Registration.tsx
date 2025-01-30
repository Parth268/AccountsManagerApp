import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { NavigationProp } from "@react-navigation/native";
import auth from '@react-native-firebase/auth';
import { NAVIGATION, STORAGE_KEYS } from "../../utils/constants";
import { Snackbar } from "../../components/Snackbar";
import { useAuth } from "../../storage/context/AuthContext";

interface RegisterProps {
    navigation: NavigationProp<any>;
}

const Register: React.FC<RegisterProps> = ({ navigation }) => {

    const { t } = useTranslation();
    const { login } = useAuth()
    const [email, setEmail] = useState<string>("pvfgg@gmail.com");
    const [password, setPassword] = useState<string>("1234567890Q");
    const [confirmPassword, setConfirmPassword] = useState<string>("1234567890Q");
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");

    const triggerSnackbar = (textData: string = "") => {
        setSnackbarMessage(textData);
        setTimeout(() => setSnackbarMessage(""), 1000); // Clear message after snackbar hides
    };

    const handleRegister = async () => {
        setLoading(true);
        if (password !== confirmPassword) {
            setLoading(false);
            triggerSnackbar(t("password_mismatch"))
            return;
        }

        if (password !== null && password?.length < 6) {
            setLoading(false);
            triggerSnackbar(t("password_required_length"))
            return;
        }

        try {
            await registerWithEmailPassword();
        } catch (error) {
            setLoading(false);
            triggerSnackbar(String(error));
        }
    };

    const registerWithEmailPassword = async () => {
        try {
            let userId = await auth().createUserWithEmailAndPassword(email, password);
            await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
            if (userId) {
                await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId?.user?.uid);
                triggerSnackbar(String(t("login_success")));

                setTimeout(()=>{
                    setLoading(false);
                    login(JSON.stringify(userId))
                },800)

            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            triggerSnackbar(String(error));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>{t('create_account')}</Text>
                <Text style={styles.subtitle}>{t('signup_description')}</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder={t('email_placeholder')}
                keyboardType="email-address"
                value={email}
                onChangeText={(text: string) => setEmail(text)}
                placeholderTextColor="#AAAAAA"
                autoFocus
            />
            <TextInput
                style={styles.input}
                placeholder={t('password_placeholder')}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text: string) => setPassword(text)}
                placeholderTextColor="#AAAAAA"
            />

            <TextInput
                style={styles.input}
                placeholder={t('confirm_password_placeholder')}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text: string) => setConfirmPassword(text)}
                placeholderTextColor="#AAAAAA"
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Text style={styles.registerButtonText}>{t('register_button')}</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginText}>{t('have_account')}</Text>
            </TouchableOpacity>

            {snackbarMessage ? <Snackbar message={snackbarMessage} /> : null}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    headerContainer: {
        marginBottom: 30,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333333",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 22,
        color: "#444444",
        textAlign: "center",
        marginTop: 5,
    },
    input: {
        width: "90%",
        height: 50,
        backgroundColor: "#F9F9F9",
        borderRadius: 15,
        paddingHorizontal: 15,
        fontSize: 16,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        color: "#333333",
    },
    eyeIcon: {
        position: "absolute",
        right: 30,
        top: 48, // Adjust based on input field height and padding
    },
    registerButton: {
        width: "90%",
        backgroundColor: "#000000",
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: "center",
        marginTop: 30,
    },
    registerButtonText: {
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    loginText: {
        marginTop: 15,
        color: "#0066CC",
        fontSize: 16,
    },
});

export default Register;
