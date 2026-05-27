import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { Article } from '../../types';
import { Colors } from '../../constants/colors';
import ArticleCard from '../../components/ArticleCard';

export default function SearchScreen() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.search(q.trim());
      setResults(data);
      setSearched(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(text), 400);
  };

  const isRTL = i18n.language === 'he';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('tabs.search')}</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, isRTL && styles.rtlInput]}
          placeholder={t('search.placeholder')}
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={handleChange}
          autoCorrect={false}
          textAlign={isRTL ? 'right' : 'left'}
        />
        {query.length > 0 && (
          <Pressable
            onPress={() => {
              setQuery('');
              setResults([]);
              setSearched(false);
            }}
            style={styles.clearBtn}
          >
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : !searched ? (
        <View style={styles.center}>
          <Text style={styles.hint}>{t('search.hint')}</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>{t('search.empty', { query })}</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ArticleCard article={item} />}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.surface,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 15,
    color: Colors.text,
  },
  rtlInput: { textAlign: 'right' },
  clearBtn: { paddingHorizontal: 12 },
  clearText: { color: Colors.textMuted, fontSize: 14 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  hint: { color: Colors.textMuted, fontSize: 14 },
  emptyText: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
});
