import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { apiClient } from './api-client';

const DEVICE_TOKEN_KEY = 'khetha_push_token';

function currentPlatform(): 'ios' | 'android' | 'web' {
  if (Platform.OS === 'ios') return 'ios';
  if (Platform.OS === 'android') return 'android';
  return 'web';
}

export const PushNotificationsService = {
  // Requests notification permission, gets an Expo push token, and registers it
  // with the backend so it can send real report-card reminders. Best-effort —
  // no-ops silently if there's no EAS project linked yet or permission is denied.
  async registerDevice(): Promise<void> {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) return;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    await apiClient.post('/Notifications/devices', { platform: currentPlatform(), token });
    await AsyncStorage.setItem(DEVICE_TOKEN_KEY, token);
  },

  // Call before clearing the auth token on logout — the endpoint requires auth.
  async unregisterDevice(): Promise<void> {
    const token = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);
    if (!token) return;
    await apiClient.delete(`/Notifications/devices?token=${encodeURIComponent(token)}`);
    await AsyncStorage.removeItem(DEVICE_TOKEN_KEY);
  },
};
