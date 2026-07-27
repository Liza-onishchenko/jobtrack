import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ua from './locales/ua.json';

export const LANGUAGE_STORAGE_KEY = 'language';

const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ua: { translation: ua },
  },
  lng: storedLanguage || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
