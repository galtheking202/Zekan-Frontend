import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { api } from '../../services/api';
import { Article, Location } from '../../types';
import { Colors } from '../../constants/colors';
import ArticleCard from '../../components/ArticleCard';

function centroid(polygon: { type: string; coordinates: unknown }): { latitude: number; longitude: number } | null {
  let ring: number[][] | null = null;
  if (polygon.type === 'Polygon') ring = (polygon.coordinates as number[][][])[0];
  else if (polygon.type === 'MultiPolygon') ring = (polygon.coordinates as number[][][][])[0]?.[0];
  if (!ring?.length) return null;
  const s = ring.reduce((a, [lon, lat]) => ({ lat: a.lat + lat, lon: a.lon + lon }), { lat: 0, lon: 0 });
  return { latitude: s.lat / ring.length, longitude: s.lon / ring.length };
}

export default function DebugMapScreen() {
  const mapRef = useRef<MapView>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Location | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);

  useEffect(() => {
    api.locations().then((locs) => {
      setLocations(locs);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!locations.length) return;
    const coords = locations
      .filter((l) => l.polygon)
      .map((l) => centroid(l.polygon!))
      .filter((c): c is { latitude: number; longitude: number } => c !== null);
    if (coords.length) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(coords, {
          edgePadding: { top: 80, right: 60, bottom: 60, left: 60 },
          animated: true,
        });
      }, 500);
    }
  }, [locations]);

  const onMarkerPress = useCallback(async (loc: Location) => {
    setSelected(loc);
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text style={styles.hint}>Loading locations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{ latitude: 31.5, longitude: 34.8, latitudeDelta: 10, longitudeDelta: 10 }}
      >
        {locations.map((loc) => {
          if (!loc.polygon) return null;
          const coord = centroid(loc.polygon);
          if (!coord) return null;
          return (
            <Marker
              key={loc.id}
              coordinate={coord}
              title={loc.name}
              description={loc.level}
              onPress={() => onMarkerPress(loc)}
            />
          );
        })}
      </MapView>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>DEBUG · {locations.length} locations</Text>
      </View>

      <Modal
        visible={!!selected}
        animationType="slide"
        transparent
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>{selected?.name}</Text>
                <Text style={styles.sheetLevel}>{selected?.level}</Text>
              </View>
              <Pressable onPress={() => setSelected(null)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </Pressable>
            </View>

            {loadingArticles ? (
              <View style={styles.center}>
                <ActivityIndicator color={Colors.primary} />
              </View>
            ) : articles.length === 0 ? (
              <View style={styles.center}>
                <Text style={styles.hint}>No articles for this location.</Text>
              </View>
            ) : (
              <FlatList
                data={articles}
                keyExtractor={(a) => a.id}
                renderItem={({ item }) => <ArticleCard article={item} />}
                contentContainerStyle={styles.list}
              />
            )}
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.background,
  },
  hint: { color: Colors.textMuted, fontSize: 14 },
  badge: {
    position: 'absolute',
    top: 56,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '75%',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  sheetLevel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  closeBtn: { padding: 4 },
  closeBtnText: { fontSize: 16, color: Colors.textSecondary, fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingVertical: 8, paddingBottom: 24 },
});
