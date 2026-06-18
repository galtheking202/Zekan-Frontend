import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

const URGENT_NOTIFICATIONS_KEY = '@zekan/urgent_notifications';
const PUSH_TOKEN_KEY = '@zekan/push_token';

/**
 * Request permission, obtain an Expo push token and register it with the backend
 * so the device receives urgent-news notifications. No-op when urgent
 * notifications are disabled, on web, or when the device has no push support.
 */
export async function registerForPush(): Promise<void> {
  if (Platform.OS === 'web') return;
  const enabled = (await AsyncStorage.getItem(URGENT_NOTIFICATIONS_KEY)) !== 'false';
  if (!enabled) return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('urgent', {
      name: 'Urgent News',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    await api.registerPushToken(token, Platform.OS);
  } catch {
    // Simulator / missing push support / network failure — non-fatal.
  }
}

/** Stop urgent-news notifications for this device. */
export async function unregisterPush(): Promise<void> {
  const token = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
  if (!token) return;
  try {
    await api.unregisterPushToken(token);
  } catch {
    // Best-effort — the token will also be pruned server-side once Expo reports it stale.
  }
}
