import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import i18n from './i18n';
import App from './App.vue';

// Import UnoCSS reset first (normalize styles)
import '@unocss/reset/tailwind.css';
// Import UnoCSS generated styles
import 'virtual:uno.css';
// Import theme definitions
import '@/assets/styles/themes.css';
// Import global custom styles
import '@/assets/styles/global.css';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Auto-register all primitive components globally
const primitives = import.meta.glob('@/components/primitives/**/*.vue', { eager: true });
for (const path in primitives) {
  const componentName = path.split('/').pop()?.replace('.vue', '');
  if (componentName) {
    app.component(componentName, (primitives[path] as any).default);
  }
}

app.use(pinia);
app.use(i18n);
app.mount('#app');

// Initialize theme and locale after mount
import { useThemeStore } from '@/stores/theme';
import { useLocaleStore } from '@/stores/locale';
// Initialize stores to trigger their watchers and apply initial state
useThemeStore();
useLocaleStore();
// Theme and locale are automatically applied via the stores' watchers
