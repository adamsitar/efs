import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export type Theme = 'dark' | 'light';

export const useThemeStore = defineStore(
  'theme',
  () => {
    const currentTheme = ref<Theme>('dark');

    // Apply theme to DOM
    function applyTheme(theme: Theme) {
      document.documentElement.dataset.theme = theme;
    }

    // Set theme and apply it
    function setTheme(theme: Theme) {
      currentTheme.value = theme;
      applyTheme(theme);
    }

    // Toggle between dark and light
    function toggleTheme() {
      setTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
    }

    // Watch for changes and apply to DOM
    watch(
      currentTheme,
      (newTheme) => {
        applyTheme(newTheme);
      },
      { immediate: true }
    );

    return {
      currentTheme,
      setTheme,
      toggleTheme,
    };
  },
  {
    persist: true,
  }
);
