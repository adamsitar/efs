import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Locale } from '@/i18n';

export const useLocaleStore = defineStore(
  'locale',
  () => {
    const currentLocale = ref<Locale>('en');

    // Apply locale to DOM and i18n
    function applyLocale(locale: Locale) {
      // Update document attributes
      document.documentElement.lang = locale;

      // Handle RTL for Arabic
      if (locale === 'ar') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    }

    // Set locale and apply it
    function setLocale(locale: Locale) {
      currentLocale.value = locale;
      applyLocale(locale);
    }

    // Cycle through locales (en → ru → ar → en)
    function cycleLocale() {
      const locales: Locale[] = ['en', 'ru', 'ar'];
      const currentIndex = locales.indexOf(currentLocale.value);
      const nextIndex = (currentIndex + 1) % locales.length;
      setLocale(locales[nextIndex]);
    }

    // Check if current locale is RTL
    function isRTL(): boolean {
      return currentLocale.value === 'ar';
    }

    // Watch for changes and apply to DOM
    watch(
      currentLocale,
      (newLocale) => {
        applyLocale(newLocale);
      },
      { immediate: true }
    );

    return {
      currentLocale,
      setLocale,
      cycleLocale,
      isRTL,
    };
  },
  {
    persist: true,
  }
);
