import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useRouter } from 'expo-router';
import { api } from '../../services/api';
import { Article } from '../../types';
import { Colors } from '../../constants/colors';
import ArticleCard from '../../components/ArticleCard';

function dedupeById(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((a) => !seen.has(a.id) && !!seen.add(a.id));
}

const DEBUG_MODE_KEY = '@zekan/debug_mode';
const MANUAL_LOCATION_ID_KEY = '@zekan/manual_location_id';
const MANUAL_LOCATION_NAME_KEY = '@zekan/manual_location_name';
const URGENT_NOTIFICATIONS_KEY = '@zekan/urgent_notifications';

export default function FeedScreen() {
  const { t, i18n } = useTranslation();
  const rtl = i18n.language === 'he';
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const notifiedIds = useRef<Set<string>>(new Set());

  const sortLatestFirst = (list: Article[]) =>
    [...list].sort((a, b) => {
      const ta = new Date(a.created_at ?? a.date).getTime();
      const tb = new Date(b.created_at ?? b.date).getTime();
      return tb - ta;
    });

  const notifyUrgent = useCallback(async (incoming: Article[]) => {
    const urgentEnabled = (await AsyncStorage.getItem(URGENT_NOTIFICATIONS_KEY)) !== 'false';
    if (!urgentEnabled) return;
    for (const article of incoming) {
      if (article.is_urgent && !notifiedIds.current.has(article.id)) {
        notifiedIds.current.add(article.id);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🔴 Breaking News',
            body: article.header,
            data: { articleId: article.id },
          },
          trigger: null,
        });
      }
    }
  }, []);

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(false);
      const debugMode = (await AsyncStorage.getItem(DEBUG_MODE_KEY)) === 'true';
      if (debugMode) {
        const data = await api.articles();
        setArticles(sortLatestFirst(data));
        await notifyUrgent(data);
        return;
      }
      const [[, manualLocationId], [, manualLocationName]] = await AsyncStorage.multiGet([
        MANUAL_LOCATION_ID_KEY,
        MANUAL_LOCATION_NAME_KEY,
      ]);
      if (manualLocationId && manualLocationName) {
        const data = await api.nearbyArticlesByName(manualLocationName, 3);
        const flat = dedupeById(data.groups.flatMap((g) => g.articles));
        setArticles(flat);
        await notifyUrgent(flat);
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const data = await api.nearbyArticles(pos.coords.latitude, pos.coords.longitude, 3);
        const flat = dedupeById(data.groups.flatMap((g) => g.articles));
        setArticles(flat);
        await notifyUrgent(flat);
      } else {
        const data = await api.articles();
        setArticles(data);
        await notifyUrgent(data);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
        <View style={[styles.titleRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <Image source={require('../../Zekan logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>{t('feed.title')}</Text>
        </View>
        <Pressable onPress={() => router.navigate('/(tabs)/search')} style={styles.searchBtn}>
          <Text style={styles.searchIcon}>🔍</Text>
        </Pressable>
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{t('feed.loadError')}</Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ArticleCard article={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load(true);
              }}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>{t('feed.empty')}</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBtn: {
    padding: 4,
  },
  searchIcon: {
    fontSize: 20,
  },
  titleRow: {
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  errorText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 22,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
});
