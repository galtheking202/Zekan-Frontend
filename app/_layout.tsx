import '../lib/i18n';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { detectAndApplyLanguage } from '../lib/languageDetector';
import { registerForPush } from '../lib/push';
import { Colors } from '../constants/colors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    registerForPush();
    detectAndApplyLanguage().finally(() => setReady(true));

    // Open the relevant article when the user taps an urgent-news notification.
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const articleId = response.notification.request.content.data?.articleId;
      if (typeof articleId === 'string') router.push(`/article/${articleId}`);
    });
    return () => sub.remove();
  }, []);

  if (!ready) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
