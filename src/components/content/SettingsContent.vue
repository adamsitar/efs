<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <div>
      <h2 class="text-base font-medium text-primary mb-2">
        {{ t('settings.applicationSettings') }}
      </h2>
      <p class="text-sm text-secondary">{{ t('settings.settingsDescription') }}</p>
    </div>

    <div class="space-y-3">
      <div>
        <label class="text-sm text-primary block mb-1">{{ t('settings.exampleSetting') }}</label>
        <input
          type="text"
          class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent"
          :placeholder="t('settings.placeholder')"
        />
      </div>

      <div>
        <label class="text-sm text-primary block mb-1">{{ t('settings.anotherSetting') }}</label>
        <select
          class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent"
        >
          <option>{{ t('settings.option1') }}</option>
          <option>{{ t('settings.option2') }}</option>
          <option>{{ t('settings.option3') }}</option>
        </select>
      </div>
    </div>
  </div>
</template>
