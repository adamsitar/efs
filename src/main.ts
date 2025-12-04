import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// Import UnoCSS reset first (normalize styles)
import '@unocss/reset/tailwind.css';
// Import UnoCSS generated styles
import 'virtual:uno.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
