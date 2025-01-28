import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const WebViewScreen = ({ navigation }) => {
    const [url, seturl] = useState('');
    const [loading, setLoading] = useState(true);  // State to manage the loading indicator

    useEffect(() => {
        const urlData = navigation.getParam('url');
        seturl(urlData);
    }, []);

    // Handle back navigation if needed
    const handleBackPress = () => {
        if (navigation && navigation.goBack) {
            navigation.goBack();
        } else {
            console.warn("No navigation prop available");
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Pressable onPress={handleBackPress} style={styles.backButton}>
                    <Text style={{ fontSize: 18, color: '#333' }}>Back</Text>
                </Pressable>
                <Text style={styles.title}>WebView Example</Text>
            </View>

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
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
    loaderContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
    }
});

export default WebViewScreen;
