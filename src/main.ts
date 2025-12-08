import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// Import UnoCSS reset first (normalize styles)
import '@unocss/reset/tailwind.css';
// Import UnoCSS generated styles
import 'virtual:uno.css';
// Import global custom styles
import '@/assets/styles/global.css';

const app = createApp(App);
const pinia = createPinia();

// Auto-register all primitive components globally
const primitives = import.meta.glob('@/components/primitives/**/*.vue', { eager: true });
for (const path in primitives) {
  const componentName = path.split('/').pop()?.replace('.vue', '');
  if (componentName) {
    app.component(componentName, (primitives[path] as any).default);
  }
}

app.use(pinia);
app.mount('#app');
