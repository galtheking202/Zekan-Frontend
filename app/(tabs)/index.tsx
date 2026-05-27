import React, { useCallback, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useRouter } from 'expo-router';
import { api } from '../../services/api';
import { Article } from '../../types';
import { Colors } from '../../constants/colors';
import ArticleCard from '../../components/ArticleCard';

export default function FeedScreen() {
  const { t, i18n } = useTranslation();
  const rtl = i18n.language === 'he';
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const load = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(false);
      const data = await api.articles();
      setArticles(data);
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
