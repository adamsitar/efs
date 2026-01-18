import { createI18n } from 'vue-i18n';
import en from './locales/en';
import ru from './locales/ru';
import ar from './locales/ar';

export type Locale = 'en' | 'ru' | 'ar';

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: 'en', // Default locale
  fallbackLocale: 'en',
  messages: {
    en,
    ru,
    ar,
  },
});

export default i18n;
