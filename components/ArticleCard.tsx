import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Article } from '../types';
import { Colors } from '../constants/colors';
import CategoryBadge from './CategoryBadge';
import CredibilityBar from './CredibilityBar';

interface Props {
  article: Article;
}

function parseUtc(dateStr: string): Date {
  return new Date(/Z$|[+-]\d{2}:\d{2}$/.test(dateStr) ? dateStr : dateStr + 'Z');
}

function timeAgo(t: ReturnType<typeof useTranslation>['t'], dateStr: string): string {
  const diff = Date.now() - parseUtc(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t('time.justNow');
  if (mins < 60) return t('time.minutesAgo', { n: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t('time.hoursAgo', { n: hours });
  return t('time.daysAgo', { n: Math.floor(hours / 24) });
}

export default function ArticleCard({ article }: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const isHe = i18n.language === 'he';
  const content = isHe
    ? article.languages?.he ?? { title: article.header, summary: article.summary, body: article.content }
    : { title: article.header, summary: article.summary, body: article.content };

  const displayDate = article.last_updated ?? article.date;
  const ago = displayDate ? timeAgo(t, displayDate) : '';

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/article/${article.id}`)}
    >
      {article.imageUrl ? (
        <Image source={{ uri: article.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : null}
      <View style={styles.body}>
        <View style={styles.meta}>
          {isHe && <Text style={[styles.time, { marginRight: 'auto' }]}>{ago}</Text>}
          <CategoryBadge category={article.category} size="sm" />
          {article.region ? (
            <Text style={styles.region} numberOfLines={1}>{article.region}</Text>
          ) : null}
          {!isHe && <Text style={[styles.time, { marginLeft: 'auto' }]}>{ago}</Text>}
        </View>

        <Text style={[styles.title, isHe && styles.rtl]} numberOfLines={2}>
          {content.title}
        </Text>
        <Text style={[styles.summary, isHe && styles.rtl]} numberOfLines={3}>
          {content.summary}
        </Text>

        <CredibilityBar score={article.credibility_score} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.92,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.surface,
  },
  body: {
    padding: 12,
    gap: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  region: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  time: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 22,
  },
  summary: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
