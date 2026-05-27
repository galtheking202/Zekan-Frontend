import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Linking,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { Article } from '../../types';
import { Colors } from '../../constants/colors';
import CategoryBadge from '../../components/CategoryBadge';

function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString(locale === 'he' ? 'he-IL' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const rtl = i18n.language === 'he';
  const textAlign = rtl ? 'right' : 'left';

  useEffect(() => {
    api.articleById(id).then((article) => {
      setArticle(article);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (!article) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.notFound}>{t('common.noData')}</Text>
      </SafeAreaView>
    );
  }

  const content = rtl
    ? article.languages?.he ?? { title: article.header, summary: article.summary }
    : { title: article.header, summary: article.summary };

  const credScore = article.credibility_score;
  const keyFacts = content.key_facts;
  const body = content.body;
  const sources = article.external_sources;

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>{rtl ? 'חזרה ←' : '← Back'}</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {article.imageUrl ? (
          <Image source={{ uri: article.imageUrl }} style={styles.hero} resizeMode="cover" />
        ) : null}

        <View style={styles.body}>
          {/* Meta */}
          <View style={[styles.metaRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
            <CategoryBadge category={article.category} />
            {article.region ? <Text style={styles.region}>{article.region}</Text> : null}
          </View>

          {/* Title */}
          <Text style={[styles.title, { textAlign }]}>{content.title}</Text>

          {/* Timestamps */}
          {(article.created_at || article.last_updated) && (
            <View style={styles.dates}>
              {article.created_at && (
                <Text style={[styles.dateText, { textAlign }]}>
                  {t('article.publishedAt')}: {formatDate(article.created_at, i18n.language)}
                </Text>
              )}
              {article.last_updated && (
                <Text style={[styles.dateText, { textAlign }]}>
                  {t('article.updatedAt')}: {formatDate(article.last_updated, i18n.language)}
                </Text>
              )}
            </View>
          )}

          {/* Credibility */}
          {credScore != null && (
            <View style={[styles.credRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.credLabel, { textAlign }]}>{t('article.credibility')}</Text>
              <Text
                style={[
                  styles.credValue,
                  {
                    color:
                      credScore >= 7 ? Colors.credHigh
                      : credScore >= 4 ? Colors.credMid
                      : Colors.credLow,
                  },
                ]}
              >
                {credScore.toFixed(1)} / 10
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          {/* Summary */}
          <Text style={[styles.summary, { textAlign }]}>{content.summary}</Text>

          {/* Body */}
          {body ? (
            <>
              <View style={styles.divider} />
              <Text style={[styles.bodyText, { textAlign }]}>{body}</Text>
            </>
          ) : null}

          {/* Key facts */}
          {keyFacts && keyFacts.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={[styles.sectionLabel, { textAlign }]}>{t('article.keyFacts')}</Text>
              <View style={styles.factsContainer}>
                {keyFacts.map((fact, i) => (
                  <View key={i} style={[styles.bulletRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                    <Text style={styles.bullet}>{rtl ? '◀' : '▶'}</Text>
                    <Text style={[styles.bulletText, { textAlign }]}>{fact}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* External sources */}
          {sources && sources.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={[styles.sectionLabel, { textAlign }]}>{t('article.sources')}</Text>
              {sources.map((url, i) => (
                <Pressable key={i} onPress={() => Linking.openURL(url)}>
                  <Text style={[styles.sourceLink, { textAlign }]} numberOfLines={1}>
                    {url}
                  </Text>
                </Pressable>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  notFound: { color: Colors.textMuted, fontSize: 15 },
  backBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  backText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
  scroll: { paddingBottom: 40 },
  hero: { width: '100%', height: 220, backgroundColor: Colors.surface },
  body: { padding: 16, gap: 12 },
  metaRow: { alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  region: { fontSize: 13, color: Colors.textMuted },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text, lineHeight: 30, letterSpacing: -0.3 },
  dates: { gap: 2 },
  dateText: { fontSize: 12, color: Colors.textMuted },
  credRow: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 8,
  },
  credLabel: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  credValue: { fontSize: 15, fontWeight: '800' },
  divider: { height: 1, backgroundColor: Colors.border },
  summary: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22 },
  bodyText: { fontSize: 15, color: Colors.text, lineHeight: 23 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  factsContainer: { gap: 8 },
  bulletRow: { gap: 8, alignItems: 'flex-start' },
  bullet: { color: Colors.primary, fontSize: 10, marginTop: 4 },
  bulletText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 20 },
  sourceLink: { fontSize: 13, color: Colors.primary, textDecorationLine: 'underline', marginBottom: 4 },
});
