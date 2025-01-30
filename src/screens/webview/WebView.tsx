import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Header from '../../components/Header';
import { useTranslation } from 'react-i18next';

interface WebViewScreenProps {
    navigation: NavigationProp<any>;
    route: RouteProp<any, any>;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const [url, setUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);  // State to manage the loading indicator

    useEffect(() => {
        // Assuming the URL is passed as a parameter via the navigation route
        const urlData = route.params?.url ?? '';  // Provide a default value if URL is undefined
        setUrl(urlData);
    }, [route.params?.url]);

    // Handle back navigation if needed


    return (
        <View style={{ flex: 1 }}>
            <Header
                navigation={navigation}
                name={t('web')}
                isHome={false}
                onBack={() => { }}
                rightIcon={<></>}
                phoneNumber={''}
            />

            {/* Show loading indicator when the web page is loading */}
            {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            {/* WebView component */}
            <WebView
                source={{ uri: url }} // Replace with the URL you want to load
                style={{ flex: 1 }}
                javaScriptEnabled={true} // Allow JavaScript
                domStorageEnabled={true} // Enable DOM storage
                startInLoadingState={false} // Disable default loading state
                onLoadStart={() => setLoading(true)}  // Show loader when page starts loading
                onLoadEnd={() => setLoading(false)}   // Hide loader when page finishes loading
                onError={() => setLoading(false)} // Hide loader on error
                onHttpError={() => setLoading(false)} // Hide loader on HTTP errors
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    loaderContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 10, // Ensure the loader is above all content
    },
});

export default WebViewScreen;
