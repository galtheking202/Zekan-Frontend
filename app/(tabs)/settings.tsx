import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import {
  setUserLanguage,
  clearUserLanguage,
  getUserLanguagePref,
} from '../../lib/languageDetector';
import { SupportedLanguage, LANGUAGE_NAMES } from '../../lib/i18n';
import { Colors } from '../../constants/colors';
import { api } from '../../services/api';
import { Location } from '../../types';


const DEBUG_MODE_KEY = '@zekan/debug_mode';
const MANUAL_LOCATION_ID_KEY = '@zekan/manual_location_id';
const MANUAL_LOCATION_NAME_KEY = '@zekan/manual_location_name';
const URGENT_NOTIFICATIONS_KEY = '@zekan/urgent_notifications';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const rtl = i18n.language === 'he';
  const [langPref, setLangPref] = useState<SupportedLanguage | null>(null);
  const [contributeOpen, setContributeOpen] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [urgentNotifications, setUrgentNotifications] = useState(true);
  const [manualLocationId, setManualLocationId] = useState<string | null>(null);
  const [manualLocationName, setManualLocationName] = useState<string | null>(null);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    getUserLanguagePref().then(setLangPref);
    AsyncStorage.getItem(DEBUG_MODE_KEY).then((v) => setDebugMode(v === 'true'));
    AsyncStorage.getItem(URGENT_NOTIFICATIONS_KEY).then((v) => setUrgentNotifications(v !== 'false'));
    AsyncStorage.getItem(MANUAL_LOCATION_ID_KEY).then(setManualLocationId);
    AsyncStorage.getItem(MANUAL_LOCATION_NAME_KEY).then(setManualLocationName);
  }, []);

  const toggleDebugMode = async () => {
    const next = !debugMode;
    setDebugMode(next);
    await AsyncStorage.setItem(DEBUG_MODE_KEY, String(next));
  };

  const toggleUrgentNotifications = async () => {
    const next = !urgentNotifications;
    setUrgentNotifications(next);
    await AsyncStorage.setItem(URGENT_NOTIFICATIONS_KEY, String(next));
  };

  const handleLocationPickerToggle = async () => {
    if (!locationPickerOpen) {
      setLocationPickerOpen(true);
      if (allLocations.length === 0) {
        setLoadingLocations(true);
        try {
          const locs = await api.locations();
          setAllLocations(locs);
        } finally {
          setLoadingLocations(false);
        }
      }
    } else {
      setLocationPickerOpen(false);
      setLocationQuery('');
    }
  };

  const selectLocation = async (loc: Location | null) => {
    if (loc === null) {
      await AsyncStorage.multiRemove([MANUAL_LOCATION_ID_KEY, MANUAL_LOCATION_NAME_KEY]);
      setManualLocationId(null);
      setManualLocationName(null);
    } else {
      await AsyncStorage.multiSet([
        [MANUAL_LOCATION_ID_KEY, loc.id],
        [MANUAL_LOCATION_NAME_KEY, loc.name],
      ]);
      setManualLocationId(loc.id);
      setManualLocationName(loc.name);
    }
    setLocationPickerOpen(false);
    setLocationQuery('');
  };

  const selectLanguage = async (lang: SupportedLanguage | null) => {
    if (lang === null) {
      await clearUserLanguage();
      setLangPref(null);
      Alert.alert(t('settings.languageAuto'), 'Language will be set on next app launch.');
    } else {
      await setUserLanguage(lang);
      setLangPref(lang);
    }
  };

  const currentLang = i18n.language as SupportedLanguage;
  const rowDir = rtl ? 'row-reverse' : 'row';
  const textAlign = rtl ? 'right' : 'left';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.pageTitle, { textAlign }]}>{t('settings.title')}</Text>

        <SectionHeader label={t('settings.location')} rtl={rtl} />
        <View style={styles.card}>
          <Pressable style={[styles.row, { flexDirection: rowDir }]} onPress={handleLocationPickerToggle}>
            <View style={[styles.rowText, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
              <Text style={[styles.rowLabel, { textAlign }]}>{t('settings.locationFeed')}</Text>
              <Text style={[styles.rowDesc, { textAlign }]}>
                {manualLocationName ?? t('settings.locationNone')}
              </Text>
            </View>
            <Text style={styles.rowValue}>{locationPickerOpen ? '▲' : '▼'}</Text>
          </Pressable>

          {locationPickerOpen && (
            <View>
              <TextInput
                style={[styles.locationSearch, { textAlign }]}
                placeholder={t('settings.locationSearch')}
                placeholderTextColor={Colors.textMuted}
                value={locationQuery}
                onChangeText={setLocationQuery}
                autoFocus
              />
              {loadingLocations ? (
                <ActivityIndicator color={Colors.primary} style={{ padding: 14 }} />
              ) : (
                <>
                  <LocationOption
                    label={t('settings.locationNone')}
                    selected={manualLocationId === null}
                    onPress={() => selectLocation(null)}
                    rtl={rtl}
                  />
                  {allLocations
                    .filter((loc) =>
                      loc.name.toLowerCase().includes(locationQuery.toLowerCase())
                    )
                    .slice(0, 8)
                    .map((loc) => (
                      <React.Fragment key={loc.id}>
                        <Separator rtl={rtl} />
                        <LocationOption
                          label={loc.name}
                          selected={manualLocationId === loc.id}
                          onPress={() => selectLocation(loc)}
                          rtl={rtl}
                        />
                      </React.Fragment>
                    ))}
                </>
              )}
            </View>
          )}
        </View>

        <SectionHeader label={t('settings.language')} rtl={rtl} />
        <View style={styles.card}>
          <LangOption
            label={t('settings.languageAuto')}
            selected={langPref === null}
            onPress={() => selectLanguage(null)}
            rtl={rtl}
          />
          <Separator rtl={rtl} />
          <LangOption
            label={LANGUAGE_NAMES.en}
            selected={langPref === 'en'}
            onPress={() => selectLanguage('en')}
            rtl={rtl}
          />
          <Separator rtl={rtl} />
          <LangOption
            label={LANGUAGE_NAMES.he}
            selected={langPref === 'he'}
            onPress={() => selectLanguage('he')}
            rtl={rtl}
          />
        </View>

        <SectionHeader label={t('settings.contribute')} rtl={rtl} />
        <View style={styles.card}>
          <Pressable style={[styles.row, { flexDirection: rowDir }]} onPress={() => setContributeOpen(v => !v)}>
            <Text style={[styles.rowLabel, { textAlign }]}>{t('settings.contribute')}</Text>
            <Text style={styles.rowValue}>{contributeOpen ? '▲' : '▼'}</Text>
          </Pressable>
          {contributeOpen && (
            <View style={[styles.infoBanner, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
              <Text style={[styles.infoText, { textAlign }]}>{t('settings.contributeMessage')}</Text>
              <Pressable onPress={() => Linking.openURL(`mailto:${t('settings.contributeEmail')}`)}>
                <Text style={[styles.infoEmail, { textAlign }]}>{t('settings.contributeEmail')}</Text>
              </Pressable>
            </View>
          )}
        </View>

        <SectionHeader label={t('settings.notifications')} rtl={rtl} />
        <View style={styles.card}>
          <Pressable style={[styles.row, { flexDirection: rowDir }]} onPress={toggleUrgentNotifications}>
            <View style={[styles.rowText, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
              <Text style={[styles.rowLabel, { textAlign }]}>{t('settings.urgentNotifications')}</Text>
              <Text style={[styles.rowDesc, { textAlign }]}>{t('settings.urgentNotificationsDesc')}</Text>
            </View>
            <Text style={[styles.rowValue, urgentNotifications && { color: Colors.primary, fontWeight: '700' }]}>
              {urgentNotifications ? '●' : '○'}
            </Text>
          </Pressable>
        </View>

        <SectionHeader label={t('settings.developer')} rtl={rtl} />
        <View style={styles.card}>
          <Pressable style={[styles.row, { flexDirection: rowDir }]} onPress={toggleDebugMode}>
            <View style={[styles.rowText, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
              <Text style={[styles.rowLabel, { textAlign }]}>{t('settings.debugMode')}</Text>
              <Text style={[styles.rowDesc, { textAlign }]}>{t('settings.debugModeDesc')}</Text>
            </View>
            <Text style={[styles.rowValue, debugMode && { color: Colors.primary, fontWeight: '700' }]}>
              {debugMode ? '●' : '○'}
            </Text>
          </Pressable>
        </View>

        <SectionHeader label={t('settings.about')} rtl={rtl} />
        <View style={styles.card}>
          <View style={[styles.row, { flexDirection: rowDir }]}>
            <Text style={[styles.rowLabel, { textAlign }]}>{t('settings.version')}</Text>
            <Text style={styles.rowValue}>{Constants.expoConfig?.version ?? '1.0.0'}</Text>
          </View>
          <Separator rtl={rtl} />
          <View style={[styles.row, { flexDirection: rowDir }]}>
            <Text style={[styles.rowLabel, { textAlign }]}>{t('settings.currentLanguage')}</Text>
            <Text style={styles.rowValue}>{LANGUAGE_NAMES[currentLang] ?? currentLang}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ label, rtl }: { label: string; rtl: boolean }) {
  return (
    <Text style={[styles.sectionHeader, { textAlign: rtl ? 'right' : 'left' }]}>
      {label.toUpperCase()}
    </Text>
  );
}

function Separator({ rtl }: { rtl: boolean }) {
  return (
    <View style={[styles.separator, rtl ? { marginRight: 16 } : { marginLeft: 16 }]} />
  );
}

function LangOption({
  label,
  selected,
  onPress,
  rtl,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  rtl: boolean;
}) {
  return (
    <Pressable style={[styles.row, { flexDirection: rtl ? 'row-reverse' : 'row' }]} onPress={onPress}>
      <Text style={[styles.rowLabel, { textAlign: rtl ? 'right' : 'left' }]}>{label}</Text>
      {selected && <Text style={styles.checkmark}>✓</Text>}
    </Pressable>
  );
}

function LocationOption({
  label,
  selected,
  onPress,
  rtl,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  rtl: boolean;
}) {
  return (
    <Pressable style={[styles.row, { flexDirection: rtl ? 'row-reverse' : 'row' }]} onPress={onPress}>
      <Text style={[styles.rowLabel, { textAlign: rtl ? 'right' : 'left', flex: 1 }]}>{label}</Text>
      {selected && <Text style={styles.checkmark}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  scroll: { paddingBottom: 40 },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 6,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 15, color: Colors.text, fontWeight: '500' },
  rowDesc: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  rowValue: { fontSize: 14, color: Colors.textSecondary },
  checkmark: { fontSize: 16, color: Colors.primary, fontWeight: '700' },
  separator: { height: 1, backgroundColor: Colors.border },
  infoBanner: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  infoText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 19,
  },
  infoEmail: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  locationSearch: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
});
