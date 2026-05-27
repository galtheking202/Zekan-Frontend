import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Modal,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { Article, Location as LocationType, LocationGroup } from '../../types';
import { Colors } from '../../constants/colors';
import ArticleCard from '../../components/ArticleCard';

type Mode = 'nearby' | 'browse';

const LEVEL_LABEL_KEY: Record<string, string> = {
  city: 'map.levelCity',
  region: 'map.levelRegion',
  country: 'map.levelCountry',
};

export default function MapScreen() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('nearby');

  // ── Near Me state ──────────────────────────────────────────────
  const [nearbyGroups, setNearbyGroups] = useState<LocationGroup[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [nearbyFetched, setNearbyFetched] = useState(false);
  const [precisionLevel, setPrecisionLevel] = useState(1);

  // ── Browse state ───────────────────────────────────────────────
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [addingLocation, setAddingLocation] = useState(false);

  // ── Near Me ────────────────────────────────────────────────────
  const loadNearby = useCallback(async (level: number) => {
    setLoadingNearby(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('map.locationDenied'), t('map.locationDeniedMsg'));
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const data = await api.nearbyArticles(pos.coords.latitude, pos.coords.longitude, level);
      setNearbyGroups(data.groups);
      setNearbyFetched(true);
    } catch {
      Alert.alert('Error', t('map.nearbyError'));
    } finally {
      setLoadingNearby(false);
    }
  }, [t]);

  // Trigger fetch when switching to Near Me or changing precision
  useEffect(() => {
    if (mode === 'nearby') {
      loadNearby(precisionLevel);
    }
  }, [mode, precisionLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Browse ─────────────────────────────────────────────────────
  const loadLocations = useCallback(async () => {
    try {
      setLoadingLocations(true);
      const data = await api.locations();
      setLocations(data);
    } catch {
      // silently fail
    } finally {
      setLoadingLocations(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const selectLocation = useCallback(async (loc: LocationType) => {
    setSelectedLocation(loc);
    setLoadingArticles(true);
    try {
      const data = await api.articlesByLocation(loc.id);
      setArticles(data);
    } catch {
      setArticles([]);
    } finally {
      setLoadingArticles(false);
    }
  }, []);

  const handleAddLocation = async () => {
    const name = newLocationName.trim();
    if (!name) return;
    setAddingLocation(true);
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL ?? ''}/locations`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, level: 'city' }),
        }
      );
      if (!res.ok) throw new Error(`${res.status}`);
      setNewLocationName('');
      setShowAddModal(false);
      await loadLocations();
    } catch {
      Alert.alert('Error', `Could not find "${name}" on the map.`);
    } finally {
      setAddingLocation(false);
    }
  };

  // ── Render helpers ─────────────────────────────────────────────
  const renderNearbyGroup = ({ item }: { item: LocationGroup }) => (
    <View style={styles.group}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupLevel}>
          {t(LEVEL_LABEL_KEY[item.level] ?? item.level)}
        </Text>
        <Text style={styles.groupName}>{item.location_name}</Text>
      </View>
      {item.articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('map.title')}</Text>
        {mode === 'browse' && (
          <Pressable style={styles.addBtn} onPress={() => setShowAddModal(true)}>
            <Text style={styles.addBtnText}>+ {t('map.addLocation')}</Text>
          </Pressable>
        )}
      </View>

      {/* Mode toggle */}
      <View style={styles.toggle}>
        <Pressable
          style={[styles.toggleBtn, mode === 'nearby' && styles.toggleBtnActive]}
          onPress={() => setMode('nearby')}
        >
          <Text style={[styles.toggleText, mode === 'nearby' && styles.toggleTextActive]}>
            {t('map.nearMe')}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.toggleBtn, mode === 'browse' && styles.toggleBtnActive]}
          onPress={() => setMode('browse')}
        >
          <Text style={[styles.toggleText, mode === 'browse' && styles.toggleTextActive]}>
            {t('map.browse')}
          </Text>
        </Pressable>
      </View>

      {/* ── Near Me panel ── */}
      {mode === 'nearby' && (
        <>
          {/* Precision selector */}
          <View style={styles.precisionRow}>
            {[1, 2, 3].map((lvl) => (
              <Pressable
                key={lvl}
                style={[styles.precisionBtn, precisionLevel === lvl && styles.precisionBtnActive]}
                onPress={() => setPrecisionLevel(lvl)}
              >
                <Text style={[styles.precisionText, precisionLevel === lvl && styles.precisionTextActive]}>
                  {t(`map.level${lvl}`)}
                </Text>
              </Pressable>
            ))}
          </View>

          {loadingNearby ? (
            <View style={styles.center}>
              <ActivityIndicator color={Colors.primary} />
              <Text style={styles.hint}>{t('map.locating')}</Text>
            </View>
          ) : nearbyFetched && nearbyGroups.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.hint}>{t('map.noNearby')}</Text>
              <Pressable style={styles.retryBtn} onPress={() => loadNearby(precisionLevel)}>
                <Text style={styles.retryText}>{t('common.retry')}</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={nearbyGroups}
              keyExtractor={(g) => g.location_id}
              renderItem={renderNearbyGroup}
              contentContainerStyle={styles.list}
            />
          )}
        </>
      )}

      {/* ── Browse panel ── */}
      {mode === 'browse' && (
        loadingLocations ? (
          <View style={styles.center}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : (
          <View style={styles.content}>
            <View style={styles.locationList}>
              <Text style={styles.sectionLabel}>{t('map.selectLocation')}</Text>
              <FlatList
                horizontal
                data={locations}
                keyExtractor={(l) => l.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.locationRow}
                renderItem={({ item }) => (
                  <Pressable
                    style={[
                      styles.locationChip,
                      selectedLocation?.id === item.id && styles.locationChipActive,
                    ]}
                    onPress={() => selectLocation(item)}
                  >
                    <Text
                      style={[
                        styles.locationChipText,
                        selectedLocation?.id === item.id && styles.locationChipTextActive,
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text style={styles.locationLevel}>{item.level}</Text>
                  </Pressable>
                )}
                ListEmptyComponent={
                  <Text style={styles.hint}>{t('map.tapHint')}</Text>
                }
              />
            </View>

            {selectedLocation && (
              <View style={styles.articleSection}>
                <Text style={styles.sectionLabel}>{selectedLocation.name}</Text>
                {loadingArticles ? (
                  <View style={styles.center}>
                    <ActivityIndicator color={Colors.primary} />
                  </View>
                ) : articles.length === 0 ? (
                  <View style={styles.center}>
                    <Text style={styles.hint}>{t('map.noArticles')}</Text>
                  </View>
                ) : (
                  <FlatList
                    data={articles}
                    keyExtractor={(a) => a.id}
                    renderItem={({ item }) => <ArticleCard article={item} />}
                    contentContainerStyle={styles.list}
                  />
                )}
              </View>
            )}

            {!selectedLocation && locations.length > 0 && (
              <View style={styles.center}>
                <Text style={styles.hint}>{t('map.selectLocation')}</Text>
              </View>
            )}
          </View>
        )
      )}

      {/* Add location modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{t('map.addLocation')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={t('map.addLocationHint')}
              placeholderTextColor={Colors.textMuted}
              value={newLocationName}
              onChangeText={setNewLocationName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewLocationName('');
                }}
              >
                <Text style={styles.cancelBtnText}>{t('common.cancel')}</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.saveBtn, addingLocation && styles.btnDisabled]}
                onPress={handleAddLocation}
                disabled={addingLocation}
              >
                <Text style={styles.saveBtnText}>
                  {addingLocation ? t('map.adding') : t('common.save')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 32 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  addBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },

  toggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  toggleBtnActive: { backgroundColor: Colors.primary },
  toggleText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  toggleTextActive: { color: Colors.white },

  precisionRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  precisionBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  precisionBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  precisionText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  precisionTextActive: { color: Colors.white },

  hint: { color: Colors.textMuted, fontSize: 14, textAlign: 'center' },
  retryBtn: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  retryText: { color: Colors.primary, fontWeight: '600', fontSize: 13 },

  list: { paddingHorizontal: 16, paddingBottom: 24 },

  group: { marginBottom: 20 },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  groupLevel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    overflow: 'hidden',
  },
  groupName: { fontSize: 16, fontWeight: '700', color: Colors.text },

  content: { flex: 1 },
  locationList: { paddingBottom: 8 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  locationRow: { paddingHorizontal: 16, gap: 8 },
  locationChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  locationChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  locationChipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  locationChipTextActive: { color: Colors.white },
  locationLevel: { fontSize: 10, color: Colors.textMuted, marginTop: 1 },
  articleSection: { flex: 1, paddingTop: 12 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalBtn: { flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center' },
  cancelBtn: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  saveBtn: { backgroundColor: Colors.primary },
  btnDisabled: { opacity: 0.6 },
  cancelBtnText: { color: Colors.textSecondary, fontWeight: '600' },
  saveBtnText: { color: Colors.white, fontWeight: '700' },
});
