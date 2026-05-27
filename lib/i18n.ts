import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import he from '../locales/he.json';

export const SUPPORTED_LANGUAGES = ['en', 'he'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  he: 'עברית',
};

export const RTL_LANGUAGES: SupportedLanguage[] = ['he'];

export function isRTL(lang: string): boolean {
  return RTL_LANGUAGES.includes(lang as SupportedLanguage);
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    he: { translation: he },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
