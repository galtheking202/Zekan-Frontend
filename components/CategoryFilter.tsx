import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';

const CATEGORIES = [
  'Politics',
  'Economy',
  'Health',
  'Technology',
  'Environment',
  'Defence and Security',
  'Sports',
  'Roads',
];

interface Props {
  selected: string | null;
  onSelect: (cat: string | null) => void;
}

export default function CategoryFilter({ selected, onSelect }: Props) {
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <Chip
        label={t('feed.allCategories')}
        active={selected === null}
        color={Colors.primary}
        onPress={() => onSelect(null)}
      />
      {CATEGORIES.map((cat) => (
        <Chip
          key={cat}
          label={cat}
          active={selected === cat}
          color={Colors.categories[cat] ?? Colors.primary}
          onPress={() => onSelect(selected === cat ? null : cat)}
        />
      ))}
    </ScrollView>
  );
}

function Chip({
  label,
  active,
  color,
  onPress,
}: {
  label: string;
  active: boolean;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: color, borderColor: color }]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
});
