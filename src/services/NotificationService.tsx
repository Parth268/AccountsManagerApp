import { Platform, PermissionsAndroid } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions';
import { DEFAULTS } from '../utils/constants';

type Notification = {
  title?: string;
  message: string;
  data?: object;
};

// Configure PushNotification
PushNotification.configure({
  // (required) Called when a notification is received
  onNotification: function (notification) {
    try {
      console.log('Notification received:', notification);

      // Process the notification
      if (notification.userInteraction) {
        console.log('Notification opened from background');
        // Handle notification tap
      } else {
        console.log('Notification received in foreground');
        // Handle foreground notification
      }

      // Ensure finish is called on iOS only
      if (notification.finish) {
        notification.finish(PushNotification.FetchResult.NoData);
      }
    } catch (error) {
      console.error('Error processing notification:', error);
    }
  },

  // Request permissions for iOS
  requestPermissions: false, // We'll handle permissions manually
  popInitialNotification: true, // Automatically show the initial notification
});


// Notification Service Setup
class NotificationService {
  constructor() {
    this.setupNotificationChannel();
  }

  // Setup notification channel for Android
  private setupNotificationChannel() {
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: DEFAULTS.NOTIFICATION_CHANNEL_1_TOKEN,
          channelName: 'Default Channel',
          channelDescription: 'Default channel for notifications',
          importance: 4, // IMPORTANCE_HIGH
          vibrate: true,
          soundName: 'default',
        },
        (created) => console.log(`Channel created: ${created}`)
      );
    }
  }

  // Check and request notification permissions
  public async checkPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      // For Android 13+ (API 33+)
      if (Platform.Version >= 33) {
        const status = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (!status) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return result === PermissionsAndroid.RESULTS.GRANTED;
        }
        return status;
      }
      // For older Android versions, permissions are granted by default
      return true;
    }

    if (Platform.OS === 'ios') {
      const status = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      const result = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
      return result === RESULTS.GRANTED;
    }

    return false;
  }

  // Show local notification
  public showLocalNotification({ title = 'App Notification', message, data = {} }: Notification) {
    try {
      PushNotification.localNotification({
        channelId: DEFAULTS.NOTIFICATION_CHANNEL_1_TOKEN,
        title,
        message,
        playSound: true,
        soundName: 'default',
        vibrate: true,
        priority: 'high',
        importance: 'high',
        data,

        // Android specific
        autoCancel: true,
        // largeIcon: 'ic_launcher',
        // smallIcon: 'ic_notification',
        // color: '#4A90E2',

        // // iOS specific
        // alertAction: 'view',
        // category: 'userAction',
      });
    } catch (e) {
      console.log("Error e ", e)
    }


  }

  // Schedule a notification
  public scheduleNotification({ title, message, data = {} }: Notification, date: Date) {
    PushNotification.localNotificationSchedule({
      channelId: DEFAULTS.NOTIFICATION_CHANNEL_1_TOKEN,
      title,
      message,
      date,
      allowWhileIdle: true,
      data,
    });
  }

  // Cancel all notifications
  public cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  // Remove displayed notifications (iOS specific)
  public removeDeliveredNotifications() {
    PushNotification.removeAllDeliveredNotifications();
  }

  // Get initial notification (when app opened from notification)
  public getInitialNotification(): Promise<PushNotification | null> {
    return new Promise((resolve, reject) => {
      PushNotification.getInitialNotification()
        .then((notification: PushNotification | null) => {
          resolve(notification); // Resolves the notification
        })
    });
  }
  
}

export default new NotificationService();