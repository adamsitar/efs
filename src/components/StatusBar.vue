<script setup lang="ts">
import { useNow, useDateFormat } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { computed, watch } from 'vue';
import { useServerConnection } from '@/composables/useServerConnection';
import { useModalsStore } from '@/stores/modals';
import { useThemeStore } from '@/stores/theme';
import { useLocaleStore } from '@/stores/locale';

const now = useNow({ interval: 1000 });
const time = useDateFormat(now, 'HH:mm:ss');

const { t, locale } = useI18n();
const { isConnected } = useServerConnection();
const modalsStore = useModalsStore();
const themeStore = useThemeStore();
const localeStore = useLocaleStore();

// Sync i18n locale with locale store
watch(
  () => localeStore.currentLocale,
  (newLocale) => {
    locale.value = newLocale;
  },
  { immediate: true }
);

// Language display names
const languageNames: Record<string, string> = {
  en: 'EN',
  ru: 'РУ',
  ar: 'ع',
};

const currentLanguageDisplay = computed(() => languageNames[localeStore.currentLocale] || 'EN');

function handleOpenSettings() {
  modalsStore.openModal({
    key: 'settings',
    title: t('settings.title'),
    width: 600,
    height: 400,
  });
}

function handleRestoreModal(key: string) {
  modalsStore.toggleMinimize(key);
}

function handleToggleTheme() {
  themeStore.toggleTheme();
}

function handleCycleLanguage() {
  localeStore.cycleLocale();
}
</script>

<template>
  <div
    class="h-6 bg-panel border-t border-border-default flex items-center justify-between px-3 text-xs font-mono"
  >
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-1">
        <div class="w-2 h-2 rounded-full" :class="isConnected ? 'bg-green-500' : 'bg-red-500'" />
        <span class="text-secondary">{{
          isConnected ? t('statusBar.connected') : t('statusBar.disconnected')
        }}</span>
      </div>

      <!-- Taskbar for minimized modals -->
      <div
        v-for="modal in modalsStore.minimizedModals"
        :key="modal.key"
        class="px-2 py-0.5 bg-elevated border border-border-default cursor-pointer hover:bg-hover transition-colors"
        @click="handleRestoreModal(modal.key)"
      >
        {{ modal.title }}
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div class="text-primary">{{ time }}</div>

      <!-- Language selector -->
      <div
        class="text-xs font-medium cursor-pointer text-primary hover:text-accent transition-colors min-w-6 text-center"
        @click="handleCycleLanguage"
        :title="t('common.language')"
      >
        {{ currentLanguageDisplay }}
      </div>

      <!-- Theme toggle icon -->
      <div
        :class="themeStore.currentTheme === 'dark' ? 'i-ph-sun' : 'i-ph-moon'"
        class="text-sm cursor-pointer text-primary hover:text-accent transition-colors"
        @click="handleToggleTheme"
        :title="
          themeStore.currentTheme === 'dark'
            ? t('statusBar.switchToLight')
            : t('statusBar.switchToDark')
        "
      />

      <!-- Settings gear icon -->
      <div
        class="i-ph-gear text-sm cursor-pointer text-primary hover:text-accent transition-colors"
        @click="handleOpenSettings"
      />
    </div>
  </div>
</template>
