import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import i18n, { SupportedLanguage, SUPPORTED_LANGUAGES, isRTL } from './i18n';

const STORAGE_KEY = '@zekan/language';

export async function detectAndApplyLanguage(): Promise<SupportedLanguage> {
  // 1. Check if user has manually set a language preference
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'he') {
    await applyLanguage(stored);
    return stored;
  }

  // 2. Derive language from device locale
  const lang = detectLanguageFromDevice();
  await applyLanguage(lang);
  return lang;
}

function detectLanguageFromDevice(): SupportedLanguage {
  try {
    const locales = Localization.getLocales();
    for (const locale of locales) {
      const tag = locale.languageTag ?? '';
      const code = tag.split('-')[0].toLowerCase() as SupportedLanguage;
      if (SUPPORTED_LANGUAGES.includes(code)) return code;
    }
  } catch {
    // fall through
  }
  return 'en';
}

export async function applyLanguage(lang: SupportedLanguage): Promise<void> {
  await i18n.changeLanguage(lang);
  const rtl = isRTL(lang);
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(rtl);
}

export async function setUserLanguage(lang: SupportedLanguage): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, lang);
  await applyLanguage(lang);
}

export async function clearUserLanguage(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function getUserLanguagePref(): Promise<SupportedLanguage | null> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'he') return stored;
  return null;
}
