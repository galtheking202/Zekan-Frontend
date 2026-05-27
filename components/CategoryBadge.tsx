import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';

interface Props {
  category: string;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({ category, size = 'md' }: Props) {
  const { t } = useTranslation();
  const color = Colors.categories[category] ?? Colors.primary;
  const label = t(`categories.${category}`, { defaultValue: category });
  return (
    <View style={[styles.badge, { backgroundColor: color + '1A' }, size === 'sm' && styles.sm]}>
      <Text style={[styles.text, { color }, size === 'sm' && styles.textSm]} numberOfLines={1}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textSm: {
    fontSize: 9,
  },
});
