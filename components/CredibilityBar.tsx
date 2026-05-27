import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';

interface Props {
  score: number | null;
}

function scoreColor(score: number): string {
  if (score >= 7) return Colors.credHigh;
  if (score >= 4) return Colors.credMid;
  return Colors.credLow;
}

export default function CredibilityBar({ score }: Props) {
  const { t, i18n } = useTranslation();
  if (score === null || score === undefined) return null;

  const rtl = i18n.language === 'he';
  const color = scoreColor(score);
  const pct: `${number}%` = `${(score / 10) * 100}%`;

  const label = <Text style={[styles.label, rtl && styles.labelRTL]}>{t('feed.credibility')}</Text>;
  const track = (
    <View style={[styles.track, rtl && styles.trackRTL]}>
      <View style={[styles.fill, { width: pct, backgroundColor: color }]} />
    </View>
  );
  const value = <Text style={[styles.score, { color }]}>{score.toFixed(1)}</Text>;

  return (
    <View style={styles.container}>
      {rtl ? value : label}
      {track}
      {rtl ? label : value}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 11,
    color: Colors.textMuted,
    width: 64,
  },
  labelRTL: {
    width: undefined,
  },
  track: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  trackRTL: {
    transform: [{ scaleX: -1 }],
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  score: {
    fontSize: 11,
    fontWeight: '600',
    width: 28,
  },
});
