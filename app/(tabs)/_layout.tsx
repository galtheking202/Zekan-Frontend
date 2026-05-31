import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';
import { Colors } from '../../constants/colors';

const MAP_ENABLED_KEY = '@zekan/map_enabled';
const DEBUG_MODE_KEY = '@zekan/debug_mode';

export default function TabsLayout() {
  const { t } = useTranslation();
  const [mapEnabled, setMapEnabled] = useState(false);
  const [debugEnabled, setDebugEnabled] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(MAP_ENABLED_KEY).then((v) => setMapEnabled(v === 'true'));
    AsyncStorage.getItem(DEBUG_MODE_KEY).then((v) => setDebugEnabled(v === 'true'));

    // Re-check when settings change (polled lightly)
    const id = setInterval(() => {
      AsyncStorage.getItem(MAP_ENABLED_KEY).then((v) => setMapEnabled(v === 'true'));
      AsyncStorage.getItem(DEBUG_MODE_KEY).then((v) => setDebugEnabled(v === 'true'));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: { borderTopColor: Colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.feed'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>📰</Text>,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('tabs.search'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🔍</Text>,
          href: null,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: t('tabs.map'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🗺️</Text>,
          href: mapEnabled ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="debug"
        options={{
          title: t('tabs.debug'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🛠️</Text>,
          href: debugEnabled ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
