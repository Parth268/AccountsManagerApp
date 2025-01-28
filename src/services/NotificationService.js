import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

// Configure PushNotification
PushNotification.configure({
    onNotification: function (notification) {
        console.log('Notification received:', notification);

        // Handle notification tap
        if (notification.userInteraction) {
            console.log('Notification tapped by user');
        }
    },
    requestPermissions: Platform.OS === 'ios', // Request permissions for iOS
});

// Create a Notification Channel (for Android)
export function setupNotificationChannel() {
    if (Platform.OS === 'android') {
        PushNotification.createChannel(
            {
                channelId: 'default-channel-id', // Unique channel ID
                channelName: 'Default Notifications', // Channel Name
                importance: 4, // Notification importance
            },
            (created) =>
                console.log(`Notification channel creation status: ${created}`)
        );
    }
}

// Trigger a Local Notification
export function showNotification(title, message) {
    PushNotification.localNotification({
        channelId: 'default-channel-id', // Required for Android
        title: title || 'Default Title', // Notification title
        message: message || 'Default Message', // Notification message
        bigText: message, // Big text for notification
        priority: 'high', // Priority for Android
        vibrate: true, // Enable vibration
    });
}

// Cancel All Notifications
export function cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
    console.log('All notifications canceled');
}
